var schedule = require('node-schedule'),
mongodb = require('mongodb'),
moment = require('moment');

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


/*var job = new schedule.Job(function() {*/
	mongodb.connect(dbstr, function (err, db) {
		if(!err) {
			console.log("We are connected");

			Mercante = db.collection('mercante');
			Cartera = db.collection('cartera');
			Parametro = db.collection('parametro');
			var today = moment().date();
			var eom = moment().endOf('month').date();
			var query;
			if(today == eom){
				query = {diaInscripcion:{$gte:today}};
			}else{
				query = {diaInscripcion:today};
			}

			Mercante.find(query).toArray(function(err,mercantes){
				if(mercantes.length==0){
					console.log("> > > > > NO SE ENCONTRARON SUSCRIPTORES. CERRANDO DB < < < < <")
					db.close();
					return;
				}
				Parametro.findOne({llave:'MENSUALIDAD'},function(err,mensualidad){
					mensualidad = mensualidad.valor;
					Parametro.findOne({datosSystem:{$exists:true}},function(err,datosSystem){
						var context = require('rabbit.js').createContext("amqp://superpower:powersuper@mitianguis.mx");
						var pubBR = context.socket('PUSH');
						var pubMR = context.socket('PUSH');
						context.on('ready', function() {
							pubBR.connect('billing-renovacion', function() {
								pubMR.connect('mercantes-renovacion', function() {
									var curr = 0;
									for(var i in mercantes){
										var mercante = mercantes[i];
										Cartera.findOne({mercante:mercante._id},function(err,cartera){
											if(cartera.varoActual < mensualidad){
												var montoACargar = mensualidad - cartera.varoActual;
												
												pubBR.write(JSON.stringify({mercante:cartera.mercante,monto:montoACargar}), 'utf8');
												console.log(">>>>> SE ENVIA A LA COLA DE COBROS "+cartera.mercante+":::"+montoACargar+" PESOS");
												curr++;
												console.log(curr);
												if(curr==mercantes.length){
													closeResources(pubBR,pubMR,context,db);
													return
												}
												
												
											}else{
												console.log(">>>>> SE ENVIA A LA COLA PARA DESCUENTO DE LA MISMA CARTERA >>>>> "+cartera.mercante);
												pubMR.write(JSON.stringify({mercante:cartera.mercante}), 'utf8');
												curr++;
												console.log(curr);
												if(curr==mercantes.length){
													closeResources(pubBR,pubMR,context,db);
													return
												}
											}
										});
									}
								});
							});
						});
					});
				})
			})
		}
	});
/*});*/

function closeResources(pubBR,pubMR,context,db){
	console.log("CERRANDO DB")
	db.close();
	console.log("CERRANDO CANAL");
	pubBR.end();
	pubMR.end();
	context.close(function(){
		console.log("Cerrando Conexion a RABBIT")
	});

}


var rule = new schedule.RecurrenceRule();
//rule.hour = 0; // fire at twelve o'clock
//rule.minute = 1; // fire at minute 0
rule.second = null; // fire at second 0
//job.schedule(rule);


var renovarSuscripcion = function(mercantes,cantidad,actual,mensualidad,datosSystem){
	if(actual == mercantes.length)
		return;
	mercante = mercantes[actual];
	Cartera.findOne({mercante:mercante._id},function(err,cartera){
		cartera.varoActual+=cantidad;
		if(cartera.varoActual < mensualidad){
			var montoACargar = mensualidad - cartera.varoActual;
			/*SE HACE EL CARGO HACIA CONEKTA Y SE HACE EL UPDATE EN LA BD.*/
			cartera.varoAcutal+=montoACargar;
			Cartera.update({_id:cartera._id},{$set:{varoActual:cartera.varoActual}},function(){
				console.log(">>>>> SE HA APLICADO LA TRANSACCIÓN POR "+montoACargar+ " PESOS");
				calcularComisionesRenovacion(mercante,mercante.mentor,1,0,cantidad,datosSystem,function(){
					renovarSuscripcion(mercantes,cantidad,1+actual,mensualidad,datosSystem);   
				});

			});
		}else{
			console.log(">>>>> SE DESCUENTA DE LOS MISMOS VAROS "+mensualidad+ " PESOS");
			calcularComisionesRenovacion(mercante,mercante.mentor,1,0,cantidad,datosSystem,function(){
				renovarSuscripcion(mercantes,cantidad,1+actual,mensualidad,datosSystem);   
			});
		}

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
