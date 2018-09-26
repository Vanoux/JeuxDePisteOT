const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');

app.use(express.static('public'));
// Création de la connexion de mysql avec le site
let connection = mysql.createConnection({
    host: 'den1.mysql1.gear.host ',
    user: 'stgo',
    password: 'Ek7eg2-7?6Vc',
    database: 'stgo'
});
//Utilisation de body-parser par le serveur
app.use(bodyparser.urlencoded({extended: false}));

// Définition du moteur de template
app.set('view engine', 'ejs');

// Définition de la route racine
app.get("/", function (req, res) {
	res.render('index');
});

// Lancement du serveur
const server = app.listen(process.env.PORT || 8080, (req, res) =>
    console.log('Server Ready')
);
//Exemple pour exporter un module
function test(){
	return 'test';
}
module.exports = test()
