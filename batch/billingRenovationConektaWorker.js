/**
 * Created by phoenix on 9/04/15.
 */

var mongodb, ObjectID, Collection, MongoClient, moment, Fiber, Promise, dbg, Cartera, Mercante, Parametro, ConektaToken;
mongodb = require('mongodb');
ObjectID = mongodb.ObjectID;
Collection = mongodb.Collection;
MongoClient = mongodb.MongoClient;
moment = require('moment');
// Fiber = require('fibers');
Promise = require('bluebird');
dbg = null;
Cartera = null;
Mercante = null;
Parametro = null;
ConektaToken = null;

var emailService = require('../api/services/EmailService'),
  assert = require('assert');

// Promise.promisifyAll(require("mongodb"));
Promise.promisifyAll(mongodb);
Promise.promisifyAll(Collection.prototype);
Promise.promisifyAll(MongoClient);

/*SE DECLARA LA CONEXIÓN SI ES DESARROLLO O PRODUCCIÓN*/
var dbstr = "mongodb://localhost:27017/dev_mitianguis";
if(process.argv.slice(2).indexOf('--prod') >= 0) {
  console.log("AMBIENTE PRODUCTIVO");
  dbstr = "mongodb://10.100.1.31:27017/mitianguis";
}

mongodb.connect(dbstr, function(err, db) {
  if(!err) {
    console.log("We are connected");

    Mercante = db.collection('mercante');
    Cartera = db.collection('cartera');
    Parametro = db.collection('parametro');
    ConektaToken = db.collection('conektaToken');

    Parametro.findOne({ llave: 'MENSUALIDAD' }, function(err, mensualidad) {
      mensualidad = mensualidad.valor;
      console.log('mensualidad: ' + mensualidad);

      Parametro.findOne({ datosSystem: { $exists: true } }, function(err, datosSystem) {
        var context = require('rabbit.js').createContext("amqp://superpower:powersuper@mitianguis.mx");

        context.on('ready', function() {
          var billRenewFailPush = context.socket('PUSH');
          var mercRenewPush = context.socket('PUSH');
          var worker = context.socket('WORKER', {prefetch: 1});
          worker.setEncoding('utf8');

          billRenewFailPush.connect('billing-renovacion-fail', function() {
            mercRenewPush.connect('mercantes-renovacion', function() {
              worker.connect('billing-renovacion', function () {
                console.log(">>>>> WORKER CONNECTED <<<<<");

                worker.on('data', function (msg) {
                  var data = JSON.parse(msg);
                  /*
                   var MongoSyncServer = require("mongo-sync").Server;
                   var server = new MongoSyncServer('127.0.0.1');
                   var MercanteSync = server.db("dev_mitianguis").getCollection("mercante");
                   */
                  console.log(">>>>> INCOMING <<<<<");
                  console.log('data.mercante: ' + data.mercante);
                  var mongoClient = MongoClient.connectAsync(dbstr)
                    .then(function (db) {
                      console.log('DB: ' + db);
                      return db.collection('mercante').findOneAsync({_id: ObjectID(data.mercante)});
                    })
                    .then(function (mercante) {
                      console.log('MERCANTE: ' + JSON.stringify(mercante));
                      // worker.ack();
                      // done();
                      if (typeof mercante.conektaToken !== 'undefined') {
                        console.log('MERCANTE.CONEKTA_TOKEN: ' + JSON.stringify(mercante.conektaToken));
                        // return db.collection('conektatoken').findOneAsync({_id: ObjectID(mercante.conektaToken)})

                        var rtrnArry = new Array();
                        rtrnArry.push(db.collection('conektatoken').findOneAsync({_id: ObjectID(mercante.conektaToken)}));
                        rtrnArry.push(db.collection('user').findOneAsync({_id: ObjectID(mercante.usuario)}));
                        rtrnArry.push(mercante);
                        return rtrnArry;
                      } else {
                        // TODO Enviar a la queue donde será infromada su situación (envío de correo electrónico)
                        // TODO , en todo caso esta situacion no debería de presentarse, por lo que se omite de momento
                        // worker.requeue();
                        worker.discard();
                        // worker._read();
                      }
                    })
                    .spread(function (conektaToken, usuario, mercante) {
                      console.log('CONEKTA_TOKEN: ' + JSON.stringify(conektaToken));
                      if (typeof conektaToken !== 'undefined') {
                        // TODO Se realiza el cargo en conekta, donde:
                        // TODO i) En caso de exito se coloca en la queue de repartición de comisiones,
                        // TODO ii) Si el cargo no fue exitoso, se coloca en la queue de notificacion de problema (envío de correo electrónico)

                        console.log('CONEKTA_TOKEN.token: ' + conektaToken.conektaToken);

                        var conektaIO = require('./conekta.io');
                        var llave_privada = 'key_fK2GfyxqqvW1KJBxmxbqCw';
                        var llave_pública = 'key_Oxhifz8dyqLeZ3xYqfGczng';

                        conektaIO.private_key = llave_privada;

                        var paymentDetail = {
                          "description": "MiTianguis Monthly Payment",
                          "amount": (mensualidad * 100),
                          "currency": "MXN",
                          "reference_id": conektaToken.mercante + '-' + moment().valueOf(),
                          "card": conektaToken.conektaToken, // conektaToken.conektaToken
                          // "card": 'tok_test_card_declined', // conektaToken.conektaToken
                          "details": {
                            // "email": "lentium.mmx@gmail.com,lentium_mmx@hotmail.com"
                            "email": usuario.email
                          }
                        };

                        var successChargeProcess = function (data, detail) {
                          console.log('successChargeProcess');
                          console.log(data);
                          console.log(detail);
                          //worker.ack();
                          worker.requeue();
                        };
                        var errorChargeProcess = function (error, detail) {
                          console.log('errorChargeProcess');
                          console.log(error);
                          console.log(detail);

                          var msg = {
                            mercante: detail.reference_id.split('-')[0],
                            monto: detail.amount / 100
                          };
                          // billRenewFailPush.end(JSON.stringify(msg), 'utf8');
                          billRenewFailPush.write(JSON.stringify(msg), 'utf8');

                          var notificationMail = {
                            to: detail.details.email, // list of receivers
                            subject: 'Hay un problema con tu membresía de Mi Tianguis', // Subject line
                            /*text: 'Por favor, actualiza tu forma de pago'
                            + ''
                            + 'Hola Jose Daniel,'
                            + ''
                            + 'Lamentamos la interrupción, pero tenemos problemas para autorizar tu MASTERCARD que finaliza en 7242. Visita https://www.netflix.com/YourAccountPayment?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=linkYourAccountpayment para volver a introducir tu información de pago o para usar otra forma de pago. Cuando hayas terminado, intentaremos verificar tu cuenta nuevamente. Si aún no funciona, comunícate con tu compañía de tarjeta de crédito.'
                            + ''
                            + 'Si tienes alguna pregunta, nos complacerá ayudarte. Llámanos en cualquier momento al 001-800-5141170.'
                            + ''
                            + 'El equipo de Netflix'
                            + ''
                            + '*************************'
                            + 'Has recibido este email como parte de tu membresía de Netflix.  Para cambiar las preferencias de email de tu cuenta en cualquier momento, visita la página Preferencias de email (https://www.netflix.com/EmailPreferences?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=email_settings) de tu cuenta. No respondas este email, ya que no podemos responder desde esta dirección. Si necesitas ayuda o deseas contactarnos, visita nuestro Centro de ayuda https://help.netflix.com/help.'
                            + ''
                            + 'Este mensaje se envió a [lentium_mmx@yahoo.com.mx] por parte de Netflix.'
                            + 'SRC: 4304.2.MX.es-MX'
                            + 'El uso del sitio web y del servicio de Netflix está sujeto a la aceptación de nuestros Términos de uso (http://www.netflix.com/TermsOfUse?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=terms_footer) y Política de privacidad y (http://www.netflix.com/PrivacyPolicy?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=privacy_footer).'
                            // plaintext body*/
                            html: '<pre>'
                            + 'Por favor, actualiza tu forma de pago'
                            + '<br>'
                            + 'Hola Jose Daniel,'
                            + '<br>'
                            + 'Lamentamos la interrupción, pero tenemos problemas para autorizar tu MASTERCARD que finaliza en 7242. Visita https://www.netflix.com/YourAccountPayment?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=linkYourAccountpayment para volver a introducir tu información de pago o para usar otra forma de pago. Cuando hayas terminado, intentaremos verificar tu cuenta nuevamente. Si aún no funciona, comunícate con tu compañía de tarjeta de crédito.'
                            + '<br>'
                            + 'Si tienes alguna pregunta, nos complacerá ayudarte. Llámanos en cualquier momento al 001-800-5141170.'
                            + '<br>'
                            + 'El equipo de Netflix'
                            + '<br>'
                            + '*************************'
                            + 'Has recibido este email como parte de tu membresía de Netflix.  Para cambiar las preferencias de email de tu cuenta en cualquier momento, visita la página Preferencias de email (https://www.netflix.com/EmailPreferences?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=email_settings) de tu cuenta. No respondas este email, ya que no podemos responder desde esta dirección. Si necesitas ayuda o deseas contactarnos, visita nuestro Centro de ayuda https://help.netflix.com/help.'
                            + '<br>'
                            + 'Este mensaje se envió a [lentium_mmx@yahoo.com.mx] por parte de Netflix.'
                            + 'SRC: 4304.2.MX.es-MX'
                            + 'El uso del sitio web y del servicio de Netflix está sujeto a la aceptación de nuestros Términos de uso (http://www.netflix.com/TermsOfUse?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=terms_footer) y Política de privacidad y (http://www.netflix.com/PrivacyPolicy?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=privacy_footer).'
                            + '</pre>'
                            , alternatives: [
                              {
                                contentType: 'text/x-web-markdown',
                                content: 'Por favor, actualiza tu forma de pago'
                                + ''
                                + 'Hola Jose Daniel,'
                                + ''
                                + 'Lamentamos la interrupción, pero tenemos problemas para autorizar tu MASTERCARD que finaliza en 7242. Visita https://www.netflix.com/YourAccountPayment?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=linkYourAccountpayment para volver a introducir tu información de pago o para usar otra forma de pago. Cuando hayas terminado, intentaremos verificar tu cuenta nuevamente. Si aún no funciona, comunícate con tu compañía de tarjeta de crédito.'
                                + ''
                                + 'Si tienes alguna pregunta, nos complacerá ayudarte. Llámanos en cualquier momento al 001-800-5141170.'
                                + ''
                                + 'El equipo de Netflix'
                                + ''
                                + '*************************'
                                + 'Has recibido este email como parte de tu membresía de Netflix.  Para cambiar las preferencias de email de tu cuenta en cualquier momento, visita la página Preferencias de email (https://www.netflix.com/EmailPreferences?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=email_settings) de tu cuenta. No respondas este email, ya que no podemos responder desde esta dirección. Si necesitas ayuda o deseas contactarnos, visita nuestro Centro de ayuda https://help.netflix.com/help.'
                                + ''
                                + 'Este mensaje se envió a [lentium_mmx@yahoo.com.mx] por parte de Netflix.'
                                + 'SRC: 4304.2.MX.es-MX'
                                + 'El uso del sitio web y del servicio de Netflix está sujeto a la aceptación de nuestros Términos de uso (http://www.netflix.com/TermsOfUse?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=terms_footer) y Política de privacidad y (http://www.netflix.com/PrivacyPolicy?pkey=BQAbAAEBEHq55/EP92gZkSNqVelkMLqAgCYVwV70cauz2EnxrXvWP5W/sdZYviTynM71nkecbQR3S2GqgXbrXIsK0UyI9NV6iNjmeZHeF+LXDpfISLqFDOWGzqVx4MZFCNZxNACcKJxuZ+LpJrQpXvtTuungJohz7DG22XEOJIa1y+VtpHzG778PoVU+NQ3EpjAP2FVtrY1I&lnktrk=EMP&g=9F7A60957376EE4B4A0A57600BC844790AC07179&lkid=privacy_footer).'
                              }
                            ]
                          };
                          emailService.sendEmail(notificationMail);

                          worker.requeue();
                        };
                        var resultChargeProcess = function (error, data, paymentDetail) {
                          console.log('resultChargeProcess');
                          console.log(error);
                          console.log(data);
                          console.log(paymentDetail);

                          if(error) {
                            error = JSON.parse(error);

                            var msg = {
                              mercante: paymentDetail.reference_id.split('-')[0],
                              monto: paymentDetail.amount / 100
                            };
                            // billRenewFailPush.end(JSON.stringify(msg), 'utf8');
                            billRenewFailPush.write(JSON.stringify(msg), 'utf8');

                            var fs = require('fs');
                            var file = fs.readFileSync('/var/www/NetflixCreditCardChargeIssue.html', 'utf8');
                            file = file.replace('[REG_EXP-NOM_USR]', mercante.nombre)
                              .replace('[REG_EXP-CONEKTA_FSB]', conektaToken.financialServiceBrand)
                              .replace('[REG_EXP-CONEKTA_CDM]', conektaToken.creditDebitCardMask)
                              .replace('[REG_EXP-ERR_CHARGE_PROCESS]', error.message_to_purchaser)
                              .replace('[REG_EXP-E_MAIL]', '[' + paymentDetail.details.email + ']');
                            // console.log(file);

                            var notificationMail = {
                              to: paymentDetail.details.email, // list of receivers
                              // cc: 'lentium_mmx@hotmail.com',
                              bcc: 'lentium_mmx@hotmail.com,lentium_mmx@yahoo.com.mx',
                              /*
                              envelope: {
                                to: paymentDetail.details.email, // list of receivers
                                cc: 'lentium_mmx@hotmail.com,lentium_mmx@yahoo.com.mx'
                              },
                              */
                              subject: 'Hay un problema con tu membresía de Mi Tianguis', // Subject line
                              // html: {path: '/var/www/NetflixCreditCardChargeIssue.html'}
                              html: file
                            };
                            emailService.sendEmail(notificationMail);
                            worker.ack();

                          } else if(data) {
                            data = JSON.parse(data);
                            var Transaccion = db.collection('transaccion');
                            var TipoTransaccion = db.collection('tipotransaccion');

                            TipoTransaccion.findOne({ordinal: 3}, function(err, item) {

                              if(err) {
                                console.log(err);
                              } else {
                                var billingTransaction = {
                                  conektaId : data.id,
                                  fechaCreacion: data.created_at,
                                  estado : data.status,
                                  moneda : data.currency,
                                  descripcion : data.description,
                                  aplicadoAlDoc : data.reference_id,
                                  importe : data.amount / 100,
                                  // fechaRecepcion : moment(),
                                  fechaRecepcion : data.paid_at,
                                  comision : data.fee / 100,
                                  tipoTransaccion: item._id,
                                  mercante: ObjectID(paymentDetail.reference_id.split('-')[0]),
                                  metodoPago: data.payment_method
                                };
                                Transaccion.insert(billingTransaction, function(err, cTrans) {
                                  console.log(cTrans.result);
                                  console.log(cTrans.ops[0]);

                                  var insertedVal = cTrans.ops[0];
                                  var msg = {
                                    mercante: insertedVal.aplicadoAlDoc.split('-')[0],
                                    monto: insertedVal.importe
                                  };

                                  Cartera.findOne({ mercante: ObjectID(insertedVal.aplicadoAlDoc.split('-')[0]) }, function(err, carteraMercante) {
                                    Cartera.update({ _id: carteraMercante._id }, { $set: { varoActual: (carteraMercante.varoActual + monto) } }, function(err, result) {

                                      // mercRenewPush.end(JSON.stringify(msg), 'utf8');
                                      mercRenewPush.write(JSON.stringify(msg), 'utf8');
                                      worker.ack();
                                    });
                                  });
                                });
                              }

                            });
                          }

                          // worker.ack();
                          // worker.requeue();
                        };

                        var charge = conektaIO.CREDIT_DEBIT_CARD_BASIC_CHARGE.create({
                          params: paymentDetail,
                          // success: successChargeProcess,
                          // error: errorChargeProcess
                          result: resultChargeProcess
                        });
                      }
                    })
                    .catch(function (err) {
                      console.log('ERROR: ' + err);
                      // worker.ack();
                      // done();
                    });
                });
              });
            });
          });
        });
      });
    });
  }
});


