const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const connection=require('./bdd.js');
//ajout css depuis le dossier suivant
app.use(express.static('public'));
// Création de la connexion de mysql avec le site

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
let blbl = function(str) {
	if (str == null) return ' ';

	return String(str).
	replace(/&/g, '&amp;').
	replace(/</g, '&lt;').
	replace(/>/g, '&gt;').
	replace(/"/g, '&quot;').
	replace(/--/g, '&#151;').
	replace(/'/g, '&#039;');
};
// Définition de la route racine
app.get("/", function (req, res) {
	sess=req.session;
	if (sess.username) {
		res.redirect('/map');
		// res.render('index',{connected:sess.username});
	}else{
		res.render('choice');
	}
});

//page map
app.get("/map", function (req,res){
	sess=req.session;
	if (sess.username){
		//on selectionne tous les POI avec leurs activités correspondantes
		let selectpoi = `SELECT DISTINCT * FROM POI LEFT JOIN activity on poi.idPOI = activity.idPOI;`;
		connection.query(selectpoi,function(error,listpoi,field){
			if(error){
				console.log(error);
			}
			else {
				//on selectionne tous les parcours
				let selectjourney = `SELECT * FROM journey;`;
				connection.query(selectjourney,function(error,listjourney,field){
					if(error){
						console.log(error);
					}
					else {
						listpoi.forEach(poi => {

							if (poi.des !=null && poi.des.indexOf("%") != -1)
							{
								poi.img = poi.des.split("%")[1];
								poi.des = poi.des.split("%")[0];
							}else{
								poi.img = "";
							}
						});
						//on selectionne toutes les réponses
						let selectresp = `SELECT * FROM response;`;
						connection.query(selectresp, function(error,listresp,field){
							if(error){
								console.log(error);
							}
							else{
								//boom on rend toutes les données dans la vue map
								res.render('map',{listpoi:listpoi,listjourney:listjourney, listresp:listresp,done:sess.poi});
							}
						})
						
					}
				})
			}
		})
	}else {
		res.redirect('/');
	}

});


//Page login
app.get('/login', function(req,res){
	res.render('login',{login:'Connect'});
});
//Page register
app.get('/register',function(req,res){
	res.render('login');
});

//Page dashboard ************************
	//Récupération info user
	app.get('/dashboard',function(req,res){
		sess=req.session;

		let id= sess.idUser;
		if(!sess.username){
			res.redirect('/')
		}
		else {
			let queryUser=`SELECT username, mail, xp FROM User WHERE idUser= '${id}'`;
			connection.query(queryUser, function(error, results, field){
				if(error){
					console.log(error)
				}
				else {
					sess.username=results[0].username;
					let username=sess.username;
					let titleJourney = `SELECT * FROM Journey`;
					connection.query(titleJourney, function (error, journeys, fields){
						if(error){
							console.log(error);
						} else {
							let title = journeys[0].titleJourney
							let title2 = journeys[1].titleJourney
							res.render('dashboard',{username:username, email:results[0].mail, xp:results[0].xp.toString(), titleJourney:title, titleJourney2:title2});
						}
					})
				}
			})
		}
	});
//Modification infos user
app.post('/edit', function(req,res){
	sess=req.session;
	let username=blbl(req.body.username);
	let email=blbl(req.body.email);
	let connect=`UPDATE user SET username = '${username}', mail = '${email}' WHERE idUser= '${sess.idUser}'`;
	connection.query(connect, function(error, results, fields){
		if(error){
			console.log(error);
		}
		else {
			res.redirect("/dashboard");
		}
	})

});
// Ajout parcours et POI sur Dashboard
// app.get('/dashboard', function (req, res) {
// 	sess=req.session;

// 	let titleJourney = `SELECT * FROM Journey;`;
// 	connection.query(titleJourney, function (error, results, fields) {
// 		if(error){
// 			console.log(error);
// 		} else {
// 			let title = results[0].titleJourney
// 			res.render('dashboard', {
// 				titleJourney: title

// 			});
// 		}
// 	})
// })





	//Lors d'une tentative de connexion
	app.post('/login',function(req,res){
		sess=req.session;
		let username=blbl(req.body.username);
		let password=blbl(req.body.password);
		let connect=`SELECT idUser, pass,xp FROM User WHERE username='${username}'`;
		connection.query(connect,function(error,results,field){
			if(error){
				console.log(error);
			}
			else if(results.length>0){
				if (bcrypt.compareSync(password, results[0].pass)) {
					sess.idUser=results[0].idUser;
					sess.username=username;
					sess.xp=results[0].xp;
					let getDone=`SELECT idPOI from Done WHERE idUser='${sess.idUser}'`;
					sess.poi=[];
					connection.query(getDone,function(error,results,field){
						if(error){
							console.log(error);
						}else if (results.length>0){
							results.forEach(function(e){
								sess.poi.push(e.idPOI);
							})
						}
					})
					res.redirect('/');
				}
			}else{
				res.redirect('/');
			}
		})
	});
//Lors d'une inscription
app.post('/register',function(req,res){
	let username=blbl(req.body.username);
	let pass=blbl(req.body.password);
	let email=blbl(req.body.email);
	bcrypt.hash(pass,null,null,function(err,hash){
		let createAccount = `INSERT INTO User (username,pass,mail,xp) VALUES ('${username}','${hash}','${email}',0)`;
		connection.query(createAccount,function(error,results,field){
			if(error){
				console.log(error);
			}else{
				res.redirect('/');
			}
		});
	})
});
//Deconnexion
app.get('/logout',function(req,res){
	req.session.destroy((err)=> {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});
//Verification de la réponse d'une activité
app.post('/act/:id',function(req,res){
	sess=req.session;
	let answer=blbl(req.body.answer);
	let idpoi=blbl(req.params.id);
	if(answer!=0){
		let validatePOI=`INSERT INTO Done (idUser,idPOI) VALUES ('${sess.idUser}','${idpoi}')`;
		connection.query(validatePOI,function(error,results,field){
			if(error){
				console.log(error);
			}else{
				let newXp=sess.xp+(+answer);
				let updateXp=`UPDATE User SET xp ='${newXp}' WHERE idUser='${sess.idUser}'`;
				connection.query(updateXp,function(error,results,field){
					if(error){
						console.log(error);
					}else{
						sess.xp=newXp;
						sess.poi.push(idpoi);
						res.redirect('/map');
					}
				})
			}
		});
	}else{
		res.redirect('/map')
	}
});
// Lancement du serveur
const server = app.listen(process.env.PORT || 8080, (req, res) =>
	console.log('Server Ready')
	);
module.exports = {blbl,bcrypt};
