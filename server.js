const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');

const session = require('express-session');
app.use(express.static('public'));
// Création de la connexion de mysql avec le site
let connection = mysql.createConnection({
	host: 'den1.mysql1.gear.host',
	user: 'stgo',
	password: 'Ek7eg2-7?6Vc',
	database: 'stgo'
});
//Utilisation de express session
app.use(session({secret: 'ssshhhhh',
	resave: true,
	saveUninitialized: true}
	));
//Preparation à l'utilisation de express session
let sess;
//Utilisation de body-parser par le serveur
app.use(bodyparser.urlencoded({extended: false}));

// Définition du moteur de template
app.set('view engine', 'ejs');
//Fonction sécurité sur les inputs
function blbl(str) {
	if (str == null) return '';

	return String(str).
	replace(/&/g, '&amp;').
	replace(/</g, '&lt;').
	replace(/>/g, '&gt;').
	replace(/"/g, '&quot;').
	replace(/'/g, '&#039;');
};
// Définition de la route racine
app.get("/", function (req, res) {
	sess=req.session;
	if (sess.username) {
		res.render('index',{connected:sess.username});
	}else{
		res.render('index');
	}
});

//page map
app.get("/map", function (req,res){
    res.render('map');
});

//Page login
app.get('/login', function(req,res){
	res.render('login',{login:'Connect'});
});
//Page register
app.get('/register',function(req,res){
	res.render('login');
});
//Lors d'une tentative de connexion
app.post('/login',function(req,res){
	sess=req.session;
	let username=blbl(req.body.username);
	let password=blbl(req.body.password);
	let connect=`SELECT pass FROM User WHERE username='${username}'`;
	if(username.length>0 && password.length>0){
		connection.query(connect,function(error,results,field){
			if(error){
				console.log(error);
			}
			else if(password==results[0].pass){
				sess.username=username;
				res.redirect('/');
			}else {
				res.redirect('/login')
			}		
		});
	}else {
		res.redirect('/login');
	}
});
//Lors d'une inscription
app.post('/register',function(req,res){
	let username=blbl(req.body.username);
	let pass=blbl(req.body.password);
	let email=blbl(req.body.email);
	let createAccount = `INSERT INTO User (username,pass,mail) VALUES ('${username}','${pass}','${email}')`;
	connection.query(createAccount,function(error,results,field){
		if(error){
			console.log(error);
		}else{
			res.redirect('/');
		}
	});
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
