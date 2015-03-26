/**
 * TiendaController
 *
 * @description :: Server-side logic for managing Tiendas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	findByMercante:function(request, response){
    var data = request.allParams();
    console.log( JSON.stringify(data) );
    Tienda.find({mercante:data}).exec(function(err, found){
      console.log( "tiendas encontradas:: " + JSON.stringify(found) );
      return response.json( found );
    });
  }
};

