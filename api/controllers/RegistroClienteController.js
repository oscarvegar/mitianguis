/**
 * RegistroController
 *
 * @description :: Server-side logic for managing Registroes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
module.exports = {
    registrarClienteNuevo:function(req,res){
        var data = req.allParams();
        console.log("Cliente: " + JSON.stringify(data) );
        
        /*
        Mercante.findOne({email:data.cliente.email, password:cliente.password}).exec(function(err,found){
            if(err){return res.json(400,err)}
            console.log(found);
            if( found == null || found.length == 0 ){
                console.log("El cliente no existe");
            }else{
                console.log("El cliente si existe");
            }
        });
        */

    },
        updateUserClient: function(req,res){
         
        var passwordUpdate = req.allParams().usuario.password;
        var usertoUpdate = req.allParams().usuario;
        var currentUser = req.session.currentUser;
        
        if( passwordUpdate){
            console.log("se actualiza con contrasena");
            User.update({id:currentUser.id},usertoUpdate).then(function(user){
                console.log(user);
                res.json(user);
            }).fail(function(err){
                console.log(err);
                res.send(500)
            })

        }else{
            console.log("se actualiza sin contrasena");
            delete usertoUpdate.password;
            User.update({id:currentUser.id},usertoUpdate).then(function(user){
                console.log(user);
                res.json(user);
            }).fail(function(err){
                console.log(err);
                res.send(500)
            })

        }
        


    }

};

