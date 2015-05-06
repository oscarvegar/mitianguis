/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt-nodejs');

module.exports = {

	attributes : {
		username : {
			type : 'string',
			required : true,
			unique : true
		},
		password : {
			type : 'string',
			required : true
		},
		email : {
			type : 'string',
			required : true
		},
		subdominio: 'string',  
		twitter:'string',
		facebook:'string',
		youtube:'string', //canal de youtube
		telefono:'string',
		direccion:'string',
		perfil : 'string', // MERCANTE, CLIENTE
		verificacion: 'int',
	    status:{
	      type:'integer',
	      defaultsTo: 1
	    },
		toJSON : function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	},

	beforeCreate : function(user, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(user.password, salt, null, function(err, hash) {
				if (err) {
					console.log(err);
					cb(err);
				} else {
					user.password = hash;
					cb(null, user);
				}
			});
		});
	},

	beforeUpdate: function (user, cb) {

		console.log("ESTA ENTRANDO A MOVER EL PASSWORD ***");
			console.log(user);
			console.log("termino user parametro");
		
		if(user.password){
	 		bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(user.password, salt, null, function(err, hash) {
					if (err) {
						console.log(err);
						cb(err);
					} else {
						user.password = hash;
						cb(null, user);
					}
				});
			});
		}else{
			cb(null, user);
		}
		
		

    },

};

