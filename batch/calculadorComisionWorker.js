
mongodb = require('mongodb'),
moment = require('moment');
var ObjectID = mongodb.ObjectID;
var dbg = null,
Mercante = null,
Cartera = null,
Parametro = null;
/*SE DECLARA LA CONEXIÓN SI ES DESARROLLO O PRODUCCIÓN*/
var dbstr = "mongodb://localhost:27017/dev_mitianguis";
if(process.argv.slice(2).indexOf('--prod')>=0){
	console.log("AMBIENTE PRODUCTIVO");
	dbstr = "mongodb://10.100.1.31:27017/mitianguis";
}

var Fiber = require('fibers');



mongodb.connect(dbstr, function (err, db) {
	if(!err) {
		console.log("We are connected");
		Mercante = db.collection('mercante');
		Cartera = db.collection('cartera');
		Parametro = db.collection('parametro');
		Parametro.findOne({llave:'MENSUALIDAD'},function(err,mensualidad){
			mensualidad = mensualidad.valor;
			Parametro.findOne({datosSystem:{$exists:true}},function(err,datosSystem){
				var context = require('rabbit.js').createContext("amqp://superpower:powersuper@mitianguis.mx");
				context.on('ready', function() {
				   var sub = context.socket('WORKER');
				   sub.connect('billing-renovacion', function() {
				   	console.log(">>>>> WORKER CONNECTED <<<<<")
				   	Fiber(function() {
				   		
					   	sub.on('data', function(data) { 
					   		var Server = require("mongo-sync").Server;
								var server = new Server('127.0.0.1');
								var MercanteSync = server.db("dev_mitianguis").getCollection("mercante");
						   	data = JSON.parse(data);
						   	console.log(">>>>> INCOMING <<<<<")
								console.log(data.mercante)
								var merc = MercanteSync.findOne({_id:ObjectID(data.mercante)});
								console.log(merc)
								renovarSuscripcion(merc,mensualidad,datosSystem,function(){
									sub.ack();
									server.close();
								});
						
							})
					   }).run();
				   }); 

				});
			});
		});
	}
});



var renovarSuscripcion = function(mercante,mensualidad,datosSystem,cb){
	Cartera.findOne({mercante:mercante._id},function(err,cartera){
		calcularComisionesRenovacion(mercante,mercante.mentor,1,0,mensualidad,datosSystem,function(){
			 cb();
		});
	});

}


var calcularComisionesRenovacion=function(mercante,mentor,nivel,repartido,varoInicial,datosSystem,cb){
	Cartera.findOne({mercante:mercante._id},function(err,fCarteraInscrito){
		Cartera.findOne({mercante:mentor},function(err,fMer){
			var cantidad = 0;
			var esSystem = false;
			/*LOGICA DE NEGOCIO DE LA CANTIDAD QUE TOCA EN LOS NIVELES*/
			if(mentor==datosSystem.datosSystem.systemId){
				cantidad = varoInicial - repartido;
				esSystem = true;
			}else if(nivel == 1){
				cantidad = 33;
			}else if(nivel == 2){
				cantidad = 33;
			}else if(nivel <=5){
				cantidad = 22;
			}else{
				cantidad = 11;
			}
			aplicarComision(fCarteraInscrito,fMer,cantidad,function(){
				if(esSystem == false && nivel <= 10){
					Mercante.findOne({_id:mentor},function(err,fmerMentor){
						calcularComisionesRenovacion(mercante, fmerMentor.mentor, 1+nivel, cantidad+repartido, varoInicial, datosSystem,cb);
					});
				}else{
					cb();
				}
			});
		});
	});
}
var aplicarComision = function(carteraOrigen,carteraDestino,cantidad,cb){
	console.log(">>>>>TRANSFIRIENDO DE "+JSON.stringify(carteraOrigen)+" A "+JSON.stringify(carteraDestino)+cantidad+" DE VARO");
	carteraOrigen.varoActual-=cantidad;
	carteraDestino.varoActual+=cantidad;
	Cartera.update({_id:carteraOrigen._id},{$set:{varoActual:carteraOrigen.varoActual}},function(){
		Cartera.update({_id:carteraDestino._id},{$set:{varoActual:carteraDestino.varoActual}},function(){
			cb();
		});
	});

}
