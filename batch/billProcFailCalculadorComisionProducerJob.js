var schedule, mongodb, ObjectID, Collection, MongoClient, Promise, moment, dbg, Mercante, Cartera, Parametro;
schedule = require('node-schedule');
mongodb = require('mongodb');
ObjectID = mongodb.ObjectID;
Collection = mongodb.Collection;
MongoClient = mongodb.MongoClient;
Promise = require('bluebird');
moment = require('moment');
dbg = null;
Mercante = null;
Cartera = null;
Parametro = null;

Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

/*SE DECLARA LA CONEXIÓN SI ES DESARROLLO O PRODUCCIÓN*/
var dbstr = "mongodb://localhost:27017/dev_mitianguis";
if(process.argv.slice(2).indexOf('--prod')>=0){
	console.log("AMBIENTE PRODUCTIVO");
	dbstr = "mongodb://10.100.1.31:27017/mitianguis";
}

var amqp = require('amqplib'),
  connection = amqp.connect('amqp://superpower:powersuper@mitianguis.mx');


/*var job = new schedule.Job(function() {*/
  // mongodb.connect(dbstr, function (err, db) {
  MongoClient.connect(dbstr, function (err, db) {
		if(!err) {
			console.log("We are connected");

      // Consumer
      connection.then(function(conn) {
        var ok = conn.createChannel();
        ok = ok.then(function(ch) {
          var index = 0,
            w = 'billing-renovacion-fail';
          var assert = ch.assertQueue(w);

          assert.then(function(ok) {
            console.log('assertOK :: ' + JSON.stringify(ok));
            Parametro = db.collection('parametro');

            var arryParams = new Array();
            arryParams.push(ok);
            arryParams.push(Parametro.findOneAsync({ llave: 'MENSUALIDAD' }));
            arryParams.push(Parametro.findOneAsync({ datosSystem: { $exists: true } }));
            return arryParams;

            /*
            Parametro.findOne({ llave: 'MENSUALIDAD' }, function(err, mensualidad) {
              mensualidad = mensualidad.valor;
            */

              // Parametro.findOne({ datosSystem: { $exists: true } },function(err, datosSystem) {

              // });

            // });

          })
          .spread(function(ok, mens, datosSystem) {
            if(ok.messageCount > 0) {

              var mensualidad = mens.valor;
              return ch.consume(w, function(msg) {
                if (msg !== null) {

                  var jsonVal = JSON.parse(msg.content.toString());
                  console.log('jsonVal -=> ' + JSON.stringify(jsonVal));

                  // var mongoClient = MongoClient.connectAsync(dbstr);
                  MongoClient.connectAsync(dbstr)
                    .then(function(db) {
                      Mercante = db.collection('mercante');
                      Cartera = db.collection('cartera');

                      var query = {
                        _id: ObjectID(jsonVal.mercante)
                      };
                      return Mercante.findOneAsync(query);
                    })
                    .then(function(mercante) {
                      return Cartera.findOneAsync({ mercante: mercante._id });
                    })
                    .then(function(cartera) {
                      if(cartera.varoActual < mensualidad) {
                        var montoACargar = mensualidad;

                        // Publisher
                        var q = 'billing-renovacion';
                        var ok2 = conn.createChannel();
                        ok2 = ok2.then(function(chw) {
                          chw.assertQueue(q);
                          var options = {
                            deliveryMode: 2,
                            contentEncoding: 'utf8'
                          };
                          // chw.sendToQueue(q, jsonVal);
                          var msg = new Buffer(JSON.stringify({ mercante: cartera.mercante, monto: montoACargar }));
                          var pubVal = chw.publish('', q, msg, options);
                          console.log(">>>>> SE ENVIA A LA COLA DE COBROS "+cartera.mercante+":::"+montoACargar+" PESOS");
                          // return pubVal;
                        });
                        /*
                        .then(function(data) {
                          console.log('then publisher channel COLA_COBROS');
                          console.log(data);

                          // return data;
                        });
                        */
                        // return ok2;
                        console.log('HACIENDO ACK AL MSG COLA_COBROS...');
                        ch.ack(msg);
                        // return ok;

                      } else {

                        // Publisher
                        var q = 'mercantes-renovacion';
                        var ok2 = conn.createChannel();
                        ok2 = ok2.then(function(chw) {
                          chw.assertQueue(q);
                          var options = {
                            deliveryMode: 2,
                            contentEncoding: 'utf8'
                          };
                          // chw.sendToQueue(q, jsonVal);
                          var msg = new Buffer(JSON.stringify({ mercante: cartera.mercante }));
                          var pubVal = chw.publish('', q, msg, options);
                          console.log(">>>>> SE ENVIA A LA COLA PARA DESCUENTO DE LA MISMA CARTERA >>>>> "+cartera.mercante);
                          // return pubVal;
                        });
                        /*
                        .then(function(data) {
                          console.log('then publisher channel DESCUENTO_CARTERA');
                          console.log(data);

                          // return data;
                        });
                        */
                        // return ok2;
                        console.log('HACIENDO ACK AL MSG DESCUENTO_CARTERA...');
                        ch.ack(msg);
                        // return ok;

                      }
                    })
                    .catch(function (err) {
                      console.log('ERROR: ' + err);
                    });

                } else {
                  console.log(':::: EL MENSAJE ES NULO ::::');
                }
              }, { noAck: false });
              /*
              .then(function(data) {
                console.log('then consumer consumeOper');
                console.log(data);

                var secs = 1;
                setTimeout(function() {
                  console.log(" [x] Done");
                  ch.close();
                  console.log(':::: DESPUES DE CERRAR EL CANAL ::::');
                  conn.close();
                  console.log(':::: DESPUES DE CERRAR LA CONEXION A RABBITMQ ::::');
                  db.close();
                  console.log(':::: DESPUES DE CERRAR LA CONEXION A MONGODB ::::');
                  return data;
                }, secs * 1000);
                // return data;
              });
              */
            /*
            } else {
              console.log('TERMINA PROGRAMA...!!');

              var secs = 1;
              setTimeout(function() {
                console.log(" [x] Done");
                ch.close();
                conn.close();
                db.close();
                return;
              }, secs * 1000);
            */
            }

          })
          .then(function(data) {
            console.log('then spread assert');
            console.log(data);

            var secs = 1;
            setTimeout(function() {
              console.log('TERMINATING PROGRAM...');
              console.log(' [x] Done');
              ch.close();
              console.log(':::: DESPUES DE CERRAR EL CANAL DE RABBITMQ ::::');
              conn.close();
              console.log(':::: DESPUES DE CERRAR LA CONEXION A RABBITMQ ::::');
              db.close();
              console.log(':::: DESPUES DE CERRAR LA CONEXION A MONGODB ::::');
              process.exit(1);
            }, secs * 1000);
          })
          .catch(function (err) {
            console.log('ERROR: ' + err);
          });
        })
        .catch(function (err) {
          console.log('ERROR: ' + err);
        });
        /*
        .then(function(data) {
          console.log('then consumer channel');
          console.log(data);
          return data;
        });
        */
        // return ok;
      })
      .catch(function (err) {
        console.log('ERROR: ' + err);
      });
      /*
      .then(function(data) {
        console.log('then consumer conn');
        console.log(data);
        return data;
      });
      */
		}
	});
/*});*/


var rule = new schedule.RecurrenceRule();
//rule.hour = 0; // fire at twelve o'clock
//rule.minute = 1; // fire at minute 0
rule.second = null; // fire at second 0
//job.schedule(rule);


