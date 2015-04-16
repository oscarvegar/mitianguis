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
  	totalEnvio:'float',
  	totalVenta:'float',
  	calificacion:'integer',
  	status:'integer',
    productosVenta:{
      collection:'productosventa',
      via:'venta'
    },
    /* DATOS VENTA */
    nombre:'string',
    telefono:'string',
    apellidoPaterno:'string',
    apellidoMaterno:'string',
    calle:'string',
    colonia:'string',
    municipio:'string',
    ciudad:'string',
    estado:'string',
    mensajes:'array',
    conektaToken:'string',
    conektaInfo:'object',

  	//TODO CUPONES
  }
};

