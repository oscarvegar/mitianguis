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
		direccion:'string',

    status:{
      type: 'integer',   // 1-Activo, 2-eliminado, 3-pendiente_renovacion,
      defaultsTo: 1
    },
    conektaToken: {
      model: 'conektaToken',
      via: 'mercante'
    },

    mentor2 : {
      model : 'mercante'
    },

    mentor3 : {
      model : 'mercante'
    },

    mentor4 : {
      model : 'mercante'
    },

    mentor5 : {
      model : 'mercante'
    },

    mentor6 : {
      model : 'mercante'
    },

    mentor7 : {
      model : 'mercante'
    },

    mentor8 : {
      model : 'mercante'
    },

    mentor9 : {
      model : 'mercante'
    },

    mentor10 : {
      model : 'mercante'
    }

	}


};
