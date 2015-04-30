/**
 * MercanteController
 *
 * @description :: Server-side logic for managing Mercantes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
var unirest = require('unirest');
module.exports = {
  currentUser:function(req,res){

    LOGS.info("CURRENT USER",req.session.currentUser)
    return res.json(req.session.currentUser)
  },
	find:function(req,res){
      Mercante.find().populateAll().exec(function(err,found){
          return res.json(found);
      });
  },
  findByUrlMercante:function(request, response){
    var data = request.allParams();
    //console.log("Data for request find mercante::: " + data + "--" + JSON.stringify(data) );
    Tienda.findOne({url:data.urlMercante}).populate('mercante').exec( function(err, found){
      if(err){return response.json(400,err)}
      if( found ){
        if(found.status === StatusService.ELIMINADO){
          return response.json(500, {mensaje:"El mercante ha sido dado de baja"});
        }
        console.log("Found :: " + JSON.stringify(found) );
        return response.json(found);
      }
      return response.send(404,{error:"El dominio " + data.urlMercante + " no existe... "});
    } );
  },

  findByCodigo:function(request, response){
    var data = request.allParams();
    //console.log("Data for request find mercante::: " + data + "--" + JSON.stringify(data) );
    Mercante.findOne({codigoMercante:data.codigoMercante}).then(function(result){
      if( !result){
        return response.json(500, {mensaje:"El mercante no existe"});
      }
      if( result.status === StatusService.ELIMINADO ){
        return response.json(500, {mensaje:"El mercante ha sido dado de baja"});
      }
      return response.json(result);
    }).fail(function(err){
      console.log("Error al buscar mercante por codigo :: " + JSON.stringify(err) );
      return response.json(500,err);
    });
  },
  findByUsuario:function(request, response){
    var data = request.allParams();
    console.log("Data for request find mercante::: " + JSON.stringify(data) );
    console.log("username: " + data.username);
    User.findOne({username:data.username}).exec(function(err,user){
      console.log("usuario encontrado >> " + user + "  :::: " + JSON.stringify(user));
      if(!user)return response.json(404,{code:-1,msg:"Mercante no encontrado"})
      if( user.perfil === "MERCANTE" ) {
        Mercante.findOne({usuario: user.id}).exec(function (err, found) {
          console.log("found mercante >> " + found);
          console.log("err mercante >> " + err);
          if (err) {
            console.log(err)
          }
          ;
          if (!found)return response.json(404, {code: -1, msg: "Mercante no encontrado"})
          if (found.status === StatusService.ELIMINADO) {
            return response.json(500, {mensaje: "El mercante ha sido dado de baja"});
          }
          return response.json(found);
        });
      }else{
        return response.json(user);
      }
    });
  },
  registrarNuevo : function(req, res) {
    var data = req.allParams();
    var mercante = data.mercante;
    var usuario = data.usuario;
    usuario.username = usuario.email;
    var mensaje = "";
    //console.log( "Data >> " + JSON.stringify(data) );
    console.log(" Mercante a regitrar::: " + JSON.stringify(mercante));
    console.log(" Usuario a modificar::: " + JSON.stringify(usuario));
    console.log(" ***************************************************");
    Parametro.findOne({datosSystem:{$exists:true}}).then(function(datosSystem){
      module.exports.setMentores(mercante, mercante.mentor.id, 2, datosSystem,
        function (mercante) {
          console.log(" *** se ejecuto callback de mercantes **** ");
          mercante.codigoMercante = moment().valueOf().toString(16).toUpperCase();
          mercante.diaInscripcion = moment().date();
          User.update({id: usuario.id}, {status: 1, perfil: 'MERCANTE'}).exec(function (err, userNew) {
            if (err) {
              return res.json(400, err);
            }
            console.log("Usuario actualizado :: " + JSON.stringify(userNew));
            mercante.usuario = usuario.id;
            mercante.conektaToken = {
              conektaToken: data.token,
              creditDebitCardMask: '',
              financialServiceBrand: '',
              mercante: mercante.id
            };
            Mercante.create(mercante).then( function( newMercante ){
              Cartera.create({varoActual: 0, ultimoMovimiento: new Date(), mercante: newMercante})
                .exec(function (err, cCar) {
                  console.log(cCar);
                  SuscripcionService.suscribir(newMercante, function (suscrito) {
                    console.log(suscrito);
                    var pago = {
                      "currency":"MXN",
                      "amount": 19800 ,
                      "description":"MiTianguis Monthly Payment",
                      "reference_id":newMercante.id + "-" + moment().valueOf(),
                      "card": data.token,
                      "details": { "email":usuario.email }
                    }
                    console.log("PAGO >>>>>", pago);
                    unirest.post("https://api.conekta.io/charges")
                      .auth({user: 'key_fK2GfyxqqvW1KJBxmxbqCw'})
                      .headers({	'Accept': 'application/vnd.conekta-v0.3.0+json',
                                  'Content-type': 'application/json'})
                      .send(pago)
                      .end(function(response){
                        console.log("*****************************************************************");
                        console.log("End de Conekta :::: " + JSON.stringify(response) );
                        if(response.statusCode == 200){
                          userNew[0].mercante = newMercante;
                          return res.json( userNew[0] );
                        }else{
                          return res.json( 500, {code:response.statusCode,body:response.body});
                        }
                      });
                  })
                });
          }).fail(function(err){
            console.error( "Error al crear mercante:: " + JSON.stringify(err)  );
            return res.json(400, err);
          });
        });
      });
    });
  },// Fin de registrarNuevo
  setMentores:function(newMercante,mentorId,nivel,datosSystem,cb){
    if(mentorId==datosSystem.datosSystem.systemId || nivel === 10){
      console.log( ">>>>>>>>>><<<<<<<<<<< Se va a ejecutar el callback" );
      newMercante['mentor'+nivel]=mentorId;
      cb(newMercante);
    }else{
      LOGS.info("ID MERCANTE PADRE NIVEL [" + nivel + "] = " + JSON.stringify(mentorId) );
      Mercante.findOne({id:mentorId}).then(function(mercanteRes){
        LOGS.info("Mercante Padre Nivel [" + nivel + "] >>>> " + JSON.stringify(mercanteRes) );
        newMercante['mentor'+nivel]=mercanteRes;
        nivel++;
        module.exports.setMentores(newMercante, mercanteRes.mentor, nivel, datosSystem,cb);
      })
    }
  }
};






