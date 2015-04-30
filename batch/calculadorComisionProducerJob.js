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
      var sortQry = {createdAt: -1};

			Mercante.find(query).sort(sortQry).toArray(function(err,mercantes){
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
												var montoACargar = mensualidad;

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


