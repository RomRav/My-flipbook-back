// Import des modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

//Import de la connexion à la BD
const db = require('./shared/db');

//Import des routes
const routesFlipbook = require('./routes/flipbook');
const routesUser = require('./routes/user');
const routesBook = require('./routes/book');

//Initialisation du module Express
const app = express();

//Déclaration des middlewares

//Gestion des données postées
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Gestion des cors (autorisation de connexion venant d'autre domaines)
app.use(cors());

//Hashage du mot de passe 
app.use((req, res, next) => {
   //Si un mot de passe à été envoyé
   if (req.body.password) {
      //Le mot de passe est hacher par le module crypto
      req.body.password = crypto.createHash('sha1')
         .update(req.body.password)
         .digest('hex');
   }
   //Renvoi à la fonction suivante 
   next();
});

//Déclaration des routes
app.use('/flipbook', routesFlipbook);
app.use('/user', routesUser);
app.use('/book', routesBook);

//Lancement de l'application
app.listen(3000);
