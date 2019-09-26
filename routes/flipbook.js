const express = require('express');

const db = require('../shared/db');
const router = express.Router();

var currentBook = 1;
var linksData,
    pageTable = [];

router.get('/', (req, res) => {
//Objet contenant les informations du flipbook
    var flipbook = {
        "name": String,
        "description": String,
        "dateCreation": Date,
        "dims": {
            "w": Number,
            "h": Number
        },
        "cover": {
            "type": String,
            "assetPreviewName": String
        },
        "pages": []
    };
//Requête avec jointure entre les tables books et coversTypes pour récupérer les informations nécessaire pour le flipbook
    var sql = 'SELECT books.bookTitle, books.description, books.creationDate, books.dimensionW, books.dimensionH';
    sql += ', coversTypes.coverType, books.coverAsset, books.nbPage ';
    sql += 'FROM books ';
    sql += 'inner join coversTypes ON books.idCoverType = coversTypes.idCoverType ';
    sql += 'WHERE books.idBook =' + currentBook + ';';
//Envoi de la 1er requête à la base de données avec en paramétre une fonction asynchone qui gérer la réponse de la BD
    db.query(sql, async (err, data) => {
        //Si il y a un erreur renvoie du message de l'erreur au format Json
        if (err) {
            res.json({ error: err });
        } else {
            data = data[0];
            //remplie l'objet flipbook avec les données retourné par la BD
            flipbook.name = data.bookTitle;
            flipbook.description = data.description;
            flipbook.dateCreation = data.creationDate;
            flipbook.dims.w = data.dimensionW;
            flipbook.dims.h = data.dimensionH;
            flipbook.cover = {
                "type": data.coverType,
                "assetPreviewName": data.coverAsset
            };
 //Contenu des liens, mis dans la variable via la fonction synchone (pour attendre le retour de la fonction avant de continuer)
            linksData = await linksQuery();
//Une fois que la fonction linksQuery à fini, boucle en fonction du nombre de page
            for (var i = 1; i <= data.nbPage; i++) {
                //Crée un objet pageAdd et le remplit des informations coorespondant
                var pageAdd = {};
                pageAdd.number = i;
                pageAdd.assetName = i + '-large.';
                pageAdd.double = false;
                pageAdd.links = [];
                //Boucle sur le contenu du tableau avec la fonction forEach
                linksData.forEach(item => {
//Si il y a une page qui dans les liens qui correspond à la page courant i, ajout des informations du lien à la page.  
                    if (item.numPage == i) {
                        //Condition qui vérifie si le lien est vers une page interne ou vers une url externe
                        if (isNaN(parseInt(item.url))) {
                            pageAdd.links.push({
                                    "coords": {
                                        "x": item.coordX,
                                        "y": item.coordY,
                                        "w": item.coordW,
                                        "h": item.coordH},
                                    "links": item.url
                                });
                        } else {
                            pageAdd.links.push({
                                    "coords": {
                                        "x": item.coordX,
                                        "y": item.coordY,
                                        "w": item.coordW,
                                        "h": item.coordH},
                                    "pages": parseInt(item.url)
                                });
                        }
                    } else {
                        pageTable.links = [];
                    }
                });
                //le contenu de la page crée est ajouté dans le tableau pageTable
                pageTable.push(pageAdd);
            }
            //Ajout du contenu du tableau des pages pageTable à l'objet flipbook
            flipbook.pages = pageTable;
            //Renvoie à la requête HTTP l'object flipbook en Json
            res.json(flipbook);
        }
    });
});

function linksQuery() {
    //En retour de la fonction une promesse
    return new Promise(resolve => {
        //Création de la requête
        var sqlLink = 'SELECT links.url, links.numPage FROM links WHERE links.idBook = ' + currentBook + ';';
        //Envoi de la requête à la BD + fonction callback pour gérer le retour
        db.query(sqlLink, (err, linksData) => {
            if (err) {
                //Réponse de la promesse si il y a une erreur
               resolve(err);
            } else {
                 //Réponse de la promesse avec les données correspondant à la requête. 
                resolve(linksData);
            }
        });
    });
}

module.exports = router;