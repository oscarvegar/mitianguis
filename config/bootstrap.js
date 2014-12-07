/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var moment = require('moment');
module.exports.bootstrap = function(cb) {

    Mercante.findOne({codigoMercante:'24201314227'}).exec(function(err,found){
        if(err){return res.json(400,err)}
        if(found == null){
            var newMer = {}
            //newMer.id = "54840ad65c75f70000a5e879";
            newMer.name="SYSTEM";
            newMer.tipo=-2000;
            newMer.codigoMercante="24201314227";
            newMer.mentor = -1;

            Mercante.create(newMer).exec(function(err,created){
                if(err){return console.log(err)}
                console.log(created)
                Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:created}).exec(function(err,cCar){
                    console.log(cCar);
                    Parametro.create({datosSystem:{systemId:created.id,carteraId:cCar.id}}).exec(function(err,cParam){
                        console.log(cParam);
                    });
                    Mercante.create({nombre:'Oscar',apellidoPaterno:'Vega',apellidoMaterno:'Rodríguez',mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARVEGAR'}).exec(function(err,createdMerc){
                        console.log(createdMerc); 
                        Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
                            console.log(cCar);

                        });
                    });
                    Mercante.create({nombre:'Jose Daniel',apellidoPaterno:'Morales',apellidoMaterno:'Ríos',mentor:created,fechaNacimiento:moment('1981 05 15').toDate(),codigoMercante:'DANIMORALES'}).exec(function(err,createdMerc){
                        Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
                            console.log(cCar);

                        });                   
                    });
                    Mercante.create({nombre:'Oscar',apellidoPaterno:'García',apellidoMaterno:'Pacheco',mentor:created,fechaNacimiento:moment('1981 08 21').toDate(),codigoMercante:'OSCARGARCIA'}).exec(function(err,createdMerc){
                        Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
                            console.log(cCar);

                        });                   
                    });
                    Mercante.create({nombre:'Oscar',apellidoPaterno:'Monroy',apellidoMaterno:'Unknown',mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARMONROY'}).exec(function(err,createdMerc){
                        Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
                            console.log(cCar);

                        });                   
                    });
                });



            }); 
        }
    });

    Parametro.findOne({llave:'MENSUALIDAD'}).exec(function(err,found){
        if(!found)
            Parametro.create({llave:'MENSUALIDAD',valor:198}).exec(function(err,cParam){
                console.log(cParam);                   
            });
    });


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
