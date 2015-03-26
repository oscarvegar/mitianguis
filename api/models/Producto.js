/**
* Producto.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		nombre:{
			type:'string',
			required:true
		},
		descripcion:{
			type:'string',
			required:true
		},
		stock:'integer',
		sku:'string',
		precio:{
			type:'float',
			required:true
		},
		precioMayoreo:'float',
		cantidadMayoreo:'integer',
		infoExtra:'string', //Ej. Tallas de ropa, capacidad, etc, etc
		costoEnvio:'float',
		garantia:'string',
		peso:'float',
		ancho:'float',
		alto:'float',
		largo:'float',
		status:'int', //-1:eliminado,0:inactivo,1:activo
		imagenesSecundarias: 'array', //strings de urls ['url1','url2']
		imagenPrincipal:'string',
		archivos:'array', //[{nombre:string,url:string,etc...}]
		visitas:'int',
		ratings:'array', //[{stars:int,comentario:string}]
    subproductos:'array', //[{modelo:string, imagen:string, precio:float, stock:integer}]
		categorias:'array', //['#hashtag1','#hashtag2']
		isPrincipal:'boolean',
		youtube:'string',
		tienda:{
			model:'tienda',
			required:true
		}
 	}
};
