/**
 * Mercante.js
 *
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt-nodejs');

module.exports = {

	attributes : {
		items : {
			model : 'item',
			via : 'mercante'
		},
		carteras : {
			model : 'cartera',
			via : 'mercante'
		},
		mentor : {
			model : 'mercante',
			required : true
		},
		usuario : {
			model : 'user',
			required : true
		},
		diaInscripcion : {
			type : 'integer',
			required : true
		},
		tiendas:{
			collection:'tienda',
			via:'mercante'
		},
		twitter:'string',
		facebook:'string',
		youtube:'string', //canal de youtube
		telefono:'string',
		direccion:'string'
	}


};
