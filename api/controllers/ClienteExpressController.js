/**
 * ClienteExpressController
 *
 * @description :: Server-side logic for managing Clienteexpresses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');
module.exports = {
    registrarClienteNuevo:function(req,res){
    var data = req.allParams();
        data.diaInscripcion = moment().date();
        clienteexpress.create(data).exec(function(err,created){
            if(err){return res.json(400,err);}
            Cartera.create({varoActual:0,ultimoMovimiento:new Date(),cliente:created}).exec(function(err,data){
                console.log(data);
                SuscripcionService.suscribir(created,function(suscrito){
                    console.log(suscrito);
                    res.json(created);
                })
            });
        }); 
    }
};