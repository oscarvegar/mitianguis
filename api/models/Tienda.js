  /**
* Tienda.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	nombre:'string',
  	descripcion:'string',
    url : {
      type : 'string',
      required : true
    },
    mercante:{
      model:'mercante',
      required:true
    },
    certificado:'integer',
    visitas:'integer',
    likes:'integer',
    logo:'string',
    facebook:'string',
    twitter:'string',
    youtube:'string',
    status:{
      type: 'integer', // 1 active, 0 inactive, 2 borrado
      defaultsTo: 1
    },
    productos:{
      collection:'producto',
      via:'tienda'
    }
	//TODO REVENTA DE PRODUCTOS DE OTRO MARKET
  }
};

