  /**
 * RegistroController
 *
 * @description :: Server-side logic for managing Registroes
 * @help :: See http://links.sailsjs.org/docs/controllers
 */
 var estafeta = require("node-estafeta");
var moment = require('moment');
  eden = require('node-eden'),


module.exports = {
  test : function(req, res) {
    console.log("peticion test");
    var passwordUpdate = req.allParams().usuario.password;
    console.log(req.allParams());
    console.log(passwordUpdate);
    console.log("termino parametro");
    var currentUser = req.session.currentUser;
    console.log("user: ");
    console.log(currentUser);

    User.update({id:currentUser.id},{email:req.allParams().usuario.email,password:passwordUpdate}).then(function(user){
      console.log(user);
      res.json(user);
    }).fail(function(err){
      console.log(err);
      res.send(500)
    })
  },
  getUserCurrent : function(req,res){
      var username = req.allParams().username;
      console.log("Informacion User");
      console.log(username);  
      User.findOne({username:username}).exec(function(err,user){
                console.log ("usuer recuperado"+user);
                console.log (user);
                 if(err) {
                   console.log(err);
                   return;
                 }
                
                return res.json(user);



        });

    },


  registrarNuevo : function(req, res) {
    /*var data = req.allParams();
    console.log("data: " + JSON.stringify(data));
    var mercante = data.mercante;
    var usuario = data.usuario;
    usuario.username = usuario.email;
    var mensaje = "";

    Mercante.findOne()
    .where({codigoMercante:mercante.mentor.codigoMercante})
    .then(function(mercante){
      console.log( "::: function then promise  ::: " );
      if(!mercante){
        throw "El mentor " + mercante.mentor.codigoMercante + " no existe.";
      }
      var user = User.findOne({email:usuario.email}).then(function(user){
        return user;
      });
      var mercanteDup = Mercante.findOne({urlMercante:mercante.urlMercante}).then(function(mercaDup){
        return mercaDup;
      });
      return [ mercante, user, mercanteDup ];
    })
    .spread( function(mercante, user, mercanteDup){
      console.log( "::: function spread  ::: " );
      console.log( "mercante found :: " + JSON.stringify(mercante) );
      console.log( "user found :: " + JSON.stringify(user) );
      console.log( "mercanteDup found :: " + JSON.stringify(mercanteDup) );
    })
    .catch( function(err){
      console.log("Error :: " + JSON.stringify(err) );
    } );

    */

    Mercante.findOne({codigoMercante:mercante.mentor.codigoMercante})
    .exec(function(err,found){
      if(err){return res.json(400,err)}
      if(found == null){
        mensaje = "El mentor " + mercante.mentor.codigoMercante + " no existe.";
        return res.json(400,{codigo:-1, mensaje:mensaje});
      }
      Parametro.findOne({datosSystem:{$exists:true}}).then(function(datosSystem){
        User.findOne({email:usuario.email})
        .exec( function( errUser, foundUser ){
          if(errUser){return res.json(400, errUser)}
          if(foundUser == null){
            mercante.mentor = found;
            module.exports.setMentores(mercante,2,found.mentor,function(mercante){
              mercante.codigoMercante = moment().valueOf().toString(16).toUpperCase();
              mercante.diaInscripcion = moment().date();
              User.create(usuario).exec( function(err, userNew){
                if(err){
                  return res.json(400,err);
                }
                mercante.usuario = userNew;
                Mercante.create(mercante).exec( function(err, created){
                  if(err){
                    return res.json(400,err);
                  }
                  Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:created})
                    .exec(function(err,cCar){
                      console.log(cCar);
                      SuscripcionService.suscribir(created,function(suscrito){
                        console.log(suscrito); res.json(created);
                      })
                    });
                });
              });
            });
          }else{
            mensaje = "Ya existe un usuario registrado con el correo proporcionado.";
            return res.json(400,{codigo:-1, mensaje:mensaje});
          }
        })
      });
    });



  },// Fin de registrarNuevo


  recuperarPassword:function(req,res){

    console.log("Recuperar Password>>>>>>>");
        var mail = req.allParams().email;
        console.log(mail);
        User.findOneByEmail(mail,function(err,fuser){
            if(!fuser){res.json({code:1});return}
            if(err){console.log(err);return res.json({code:-1})};
            var word =  eden.word()+ new Date().getMilliseconds()+new Date().getMinutes();
            fuser.password = word ;
            console.log("Password");
            console.log(fuser.password);
            fuser.save();
            var notificationMail = {
                to: fuser.email, // list of receivers
                subject: 'Restablecer Contraseña', // Subject line
                text:  'Tu contraseña ha sido restablecida. \n\n Tu nueva contraseña es: '+word// plaintext body
            };
            EmailService.sendEmail(notificationMail);
            res.json({code:1});
        });
    },

    setMentores:function(newMercante,mentorId,nivel,datosSystem,cb){
      if(mentorId==datosSystem.datosSystem.systemId || nivel === 10){
        newMercante['mentor'+nivel]=mentorId;
        cb(newMercante);
      }else{
        Mercante.findOne({id:mentorId}).then(function(mercanteRes){
          newMercante['mentor'+nivel]=mercanteRes;
          nivel++;
          setMentores(newMercante,mercanteRes.mentor,nivel,datosSystem,cb);
        })
      }
    },

    registrarUser:function(req,res){


    var data = req.allParams();
    console.log("data: " + JSON.stringify(data));
    var usuario = data;
    var passwrd = usuario.passwordUser;

    console.log("Registrar Usuario");
    console.log(usuario);

    user = {};
    user.username = usuario.username;
    user.password = usuario.passwordUser;
    user.email = usuario.username;
    user.perfil = "CLIENTE";
    user.verificacion = 0;
    user.codigoActivacion =new Date().getHours() + new Date().getSeconds() + new Date().getMilliseconds()+ new Date().getMinutes();
    user.subdominio = usuario.subdominio;
    user.mentor = usuario.mentor
    passwordEnvio = usuario.passwordUser;

    

    console.log(user);

     User.create(user).exec( function(err, userNew){
          if(err){
                console.log(err);
                return res.json(400,err);
            }

          EmailService.enviarBienvenidaCliente(user.username, passwordEnvio);
          return res.json(200,userNew);
      });
    }





};
