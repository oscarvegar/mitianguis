/**
* Venta.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	folio:'float',
  	tienda:{
  		model:'tienda'
  	},
  	cliente:{
  		model:'user'
  	},
  	productosVenta:{
  		collection:'productosventa',
  		via:'venta'
  	},
  	totalEnvio:'float',
  	totalVenta:'float',
  	calificacion:'integer',
  	status:'integer'
  	//TODO CUPONES
  }
};

