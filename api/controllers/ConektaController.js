/**
 * ConektaController
 *
 * @description :: Server-side logic for managing Conektas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	responseConekta:function(req,res){
        var data = req.allParams();
        console.log("RECIBIENDO DATOS DESDE CONEKTA >>>>>");
        console.log(JSON.stringify(data));
        //logica para recuperar al mercante
        Mercante.findOne({codigoMercante:data.codigoMercante}).exec(function(err,fMercante){
            SuscripcionService.renovarSuscripcion(fMercante,198,function(res){
                console.log("RENOVACION DE SUSCRIPCION >>>>");
                console.log(res);
            });
        })
        res.json({code:0,message:"Se ha recibido la notificación de cobro de suscripción"})
    }
};

