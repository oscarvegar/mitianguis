/**
* ProductosVenta.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		venta:{
			model:'venta'
		},
		producto:{
			model:'producto'
		},
		precioVenta:'float',
		cantidad:'int',
		subtotal:'float',
		subtotalEnvio:'float'
	}
};

