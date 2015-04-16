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
				return res.send({message : 'login successful', user:user});
			});
		})(req, res);
	},

	logout : function(req, res) {
		req.logout();
		req.session.destroy();
		res.send({message : 'Logout successful'});
	}

};
