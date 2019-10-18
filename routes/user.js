const express = require('express');
const router = express.Router();


//Importation du module de connexion à la bd
const db = require('../shared/db');

//Récupération du contenu de la table users
router.get('/all', (req, res) => {
    const sql = "SELECT * FROM users;";
    db.query(sql, (err, rows) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json({ user: rows });
        }
    });
});

//Récupération d'un enregistrement de la table users par son email
router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE email=?;";
    const id = req.params.id;
    db.query(sql, id, (err, rows) => {
        if (err) {
            res.json({ error: err });
        } else {

            res.json({ userRes: rows });
        }
    });
});

//Récupération d'un enregistrement de la table users par son email et mot de passe
router.post('/auth', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = "SELECT * FROM users WHERE email=\"" + email + "\" AND password=\"" + password + "\";";
    db.query(sql, (err, rows) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json({ user: rows });
        }
    });
});



//Récupération des users possédant un livre définit par son id
router.get('/book/:id', (req, res) => {
    const sql = "SELECT * FROM users inner join posseder ON users.idUser = posseder.idUser inner join books ON posseder.idbook = books.idBook where books.idBook = 1 ORDER BY userName;";
    const id = req.params.id;
    db.query(sql, id, (err, rows) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json({ user: rows });
        }
    });
});



//Enregistrement d'un user
//Utilisation de la fonction "post" de l'objet Router du module Express pour gérer les requêtes d'insertion dans la base de données
router.post('/add', (req, res) => {
    //La requête SQL INSERT pour crée un utilisateur
    const sql = "INSERT INTO users SET ?;";
    //constante qui contient les informations nécessaire à la création d'un utilisateur récupéré dépuis l'envoi de la requête HTTP
    const insertData = {
        userName: req.body.userName,
        userFirstname: req.body.userFirstname,
        email: req.body.email,
        password: req.body.password,
        idRight: '3'
    };

    //Appel à la methode query avec en paramétre la requête sql, les données insertData et un callback qui contient le message retour de la Bd 
    db.query(
        sql,
        insertData,
        (err, results) => {
            //Géstion du message de retour Bd
            if (err) {
                res.json({ error: err });
            } else {
                res.json({ insert: 'ok', idUser: results.insertId });
            }
        });
});

//Enregistrement d'un user
//Utilisation de la fonction "post" de l'objet Router du module Express pour gérer les requêtes d'insertion dans la base de données
router.post('/', (req, res) => {
    //Appel à la procédure stockée insertUser
    const sql = "CALL insertUser(?);";
    //constante qui contient les informations nécessaire à la création d'un utilisateur récupéré dépuis l'envoi de la requête HTTP
    const insertData = {
        userName: req.body.userName,
        userFirstname: req.body.userFirstname,
        email: req.body.email,
        password: req.body.mdp,
        idRight: req.body.idRight
    };
    //Appel à la methode query avec en paramétre la requête sql, les données insertData et un callback qui contient le message retour de la Bd 
    db.query(
        sql,
        insertData,
        (err) => {
            //Géstion du message de retour Bd
            if (err) {
                res.json({ error: err });
            } else {
                res.json({ insert: 'ok' });
            }
        });
});


//Suppression d'un user
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?;';
    const id = req.params.id;

    db.query(sql, id, (err) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json({ delete: 'ok' });
        }
    });

});


//Modification d'un user
router.put('/:id', (req, res) => {
    const updateData = [
        req.body.userName,
        req.body.userFirstname,
        req.body.email,
        req.body.idRight,
        req.params.id
    ];
    const sql = `UPDATE users SET userName=?, userFirstname=?, email=?, idRight=? WHERE id=?;`;

    dbConnextion.query(sql, updateData, (err) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json({ update: 'ok' });
        }
    });
});


//Récupération des livres possédé par un utilisateur définit par son email
router.get('/bookList/:id', (req, res) => {
    const sql = "SELECT * FROM books inner join posseder ON posseder.idbook = books.idBook inner join users ON users.idUser = posseder.idUser where users.email = ?";
    const id = req.params.id;
    db.query(sql, id, (err, rows) => {
        if (err) {
            res.json({ error: err });
        } else {
            res.json({ dataBookList: rows });
        }
    });
});





module.exports = router;