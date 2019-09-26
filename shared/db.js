// Import du module mysql
const mySql = require('mysql');

//Création de la connexion à la BD
const connexion = mySql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: ''
    }
);

//Utilisation de la BD flipbook
connexion.query('USE flipbook');


//Export du module de connexion
module.exports = connexion;