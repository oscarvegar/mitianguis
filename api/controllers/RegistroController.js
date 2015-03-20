/**
 * RegistroController
 * 
 * @description :: Server-side logic for managing Registroes
 * @help :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
module.exports = {
	test : function(req, res) {
		for (var i = 0; i < 1; i++)
			RabbitClient.publish({
				welcome : 'rabbit.js >>>' + i,
				num : 0
			}, 'colaUno');
		res.send(200)
	},
	registrarNuevo : function(req, res) {
		var data = req.allParams();
		console.log("data: " + JSON.stringify(data));
		var mercante = data.mercante;
		var usuario = data.usuario;
		usuario.username = usuario.email;
		var mensaje = "";
		Mercante.findOne({codigoMercante:mercante.mentor.codigoMercante})
		.exec(function(err,found){
			if(err){return res.json(400,err)} 
			if(found == null){ 
				mensaje = "El mentor " + mercante.mentor.codigoMercante + " no existe.";
				return res.json(400,{codigo:-1, mensaje:mensaje});
			}
			User.findOne({email:usuario.email})
			.exec( function( errUser, foundUser ){
				if(errUser){return res.json(400, errUser)}
				if(foundUser == null){ 
					mercante.mentor = found;
					mercante.codigoMercante = moment().valueOf().toString(16).toUpperCase();
					mercante.diaInscripcion = moment().date();
					User.create(usuario).exec( function(err, userNew){
						if(err){
							return res.json(400,err);
						}
						mercante.usuario = userNew;
						Mercante.create(mercante).exec( function(err, created){ 
							if(err){
								return res.json(400,err);
							} 
							Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:created})
							.exec(function(err,cCar){ 
								console.log(cCar);
								SuscripcionService.suscribir(created,function(suscrito){
									console.log(suscrito); res.json(created); 
								}) 
							});
						}); 
					});
				}else{
					mensaje = "Ya existe un usuario registrado con el correo proporcionado.";
					return res.json(400,{codigo:-1, mensaje:mensaje});
				}
			} );
		});
	}
};
