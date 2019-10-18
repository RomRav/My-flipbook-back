const express = require('express');
const router = express.Router();
const db = require('../shared/db');
const formidable = require('formidable');


//Ajout d'un livre à la BD et création du lien user book dans la table posseder
router.post('/:id', (req, res) => {
    const sql = "INSERT INTO books SET ?";
    const insertData = {
        bookTitle: req.body.bookTitle,
        nbPage: req.body.file.length,
        creationDate: req.body.creationDate,
        dimensionW: 100,
        dimensionH: 100,
        coverAsset: 'yy',
        description: req.body.description,
        idCoverType: 1,
        idFileType: 1
    };
    const idUser = req.params.id;

    db.query(sql, insertData, (err, results) => {
        if (err) {
            res.json({ error: err });
        } else {
            const linkBookToUser = {
                idBook: results.insertId,
                idUser: idUser
            }
            db.query('INSERT INTO posseder SET ?', linkBookToUser,
                (err) => {
                    if (err) {
                        res.json({ error: err });
                    } else {
                        res.json({ insert: 'OK' });
                    }
                });
        }
    });
});

//requet liste des types de couverture
router.get('/coverTypes', (req, res) => {
    const sql = 'SELECT * from coverstypes';
    db.query(sql, (err, rows) => {
        if (err) {
            res.json({ erreur: err });
        } else {
            res.json({ covers: rows });
        }
    });
});



module.exports = router;