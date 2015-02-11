/**
 * RegistroController
 *
 * @description :: Server-side logic for managing Registroes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var moment = require('moment');
 module.exports = {
    test:function(req,res){
        for(var i=0;i<1;i++)
            RabbitClient.publish({welcome: 'rabbit.js >>>'+i,num:0},'colaUno');  
        res.send(200)
  },
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
        data.diaInscripcion = moment().date();
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

