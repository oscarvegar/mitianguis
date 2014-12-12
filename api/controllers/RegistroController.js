/**
 * RegistroController
 *
 * @description :: Server-side logic for managing Registroes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
module.exports = {
    registrarNuevo:function(req,res){
        var data = req.allParams();
        Mercante.findOne({codigoMercante:data.mentor.codigoMercante}).exec(function(err,found){
            if(err){return res.json(400,err)}
            console.log(found);
            if(found == null){
                return res.json(400,{codigo:-1,mensaje:"El mentor "+data.mentor.codigoMercante+" no existe."})
            }
            data.mentor = found;
            data.codigoMercante = moment().valueOf().toString(16).toUpperCase();
            Mercante.create(data).exec(function(err,created){
                if(err){return res.json(400,err);}
                Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:created}).exec(function(err,cCar){
                    console.log(cCar);
                    SuscripcionService.suscribir(created,function(suscrito){
                        console.log(suscrito);
                        res.json(created);
                    })
                });
            }); 
        });


    }
};

