const express = require('express');
const router = express.Router();
const db = require('../shared/db');

router.post('/:id', (req, res) => {
    const sql = "INSERT INTO books SET ?";
    const insertData = {
        bookTitle: req.body.bookTitle,
        nbPage: 5,
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
            console.log(linkBookToUser);
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


module.exports = router;