/**
 * AuthController
 *
 * @description :: Server-side logic for managing Authentication User Mercante
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {

	login : function(req, res) {
		res.view();
	},

	process : function(req, res) {
		passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
				return res.send({ message : 'login failed'});
				res.send(err);
			}
			req.logIn(user, function(err) {
				if (err) res.send(err);
        user.password = null;
        req.session.currentUser = user;
				return res.send({message : 'login successful', user:user});
			});
		})(req, res);
	},

	logout : function(req, res) {
		req.logout();
		req.session.destroy();
		res.send({message : 'Logout successful'});
	},

     activarCuenta: function  (req, res) {
          console.log("Entra Funcion");

          console.log(req.allParams().codigo);
		  var codigoActivacion = req.allParams().codigo;

           User.findOneByCodigoActivacion(codigoActivacion,function(err,fuser){
 
            if(!fuser){res.json({code:1});return}
            if(err){console.log(err);return res.json({code:-1})};           
            fuser.verificacion = 1;
            fuser.cambioPassword = 0;
            fuser.save();
            //res.json({code:1});
            res.redirect('http://mitianguis.mx/#/');
          
        });


      }

};
