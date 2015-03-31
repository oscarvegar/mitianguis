/**
 * TiendaController
 *
 * @description :: Server-side logic for managing Tiendas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
module.exports = {
	findByMercante:function(request, response){
    var data = request.allParams().id;
    console.log( JSON.stringify(data) );
    Tienda.find({mercante:data}).exec(function(err, found){
      console.log( "tiendas encontradas:: " + JSON.stringify(found) );
      return response.json( found );
    });
  },
  create:function(request, response){
    var data = JSON.parse(request.allParams().tienda);
    var file = request.file('file') ;
    console.log( JSON.stringify(data) );
    console.log("PATH to Save   :: " + ImagenService.PATH_LOGO);
    file.upload({dirname:ImagenService.PATH_LOGO}, function(err, files) {
      var archivo = files[0];
      var indexDiag = archivo.fd.lastIndexOf("/");
      var nombreArchivo = archivo.fd.substring(indexDiag + 1);
      console.log("nombre de archivo:: " + nombreArchivo);
      data.url=nombreArchivo;
      data.fileLogo = archivo;
      Tienda.create(data).exec(function(err, newTienda){
        if(err) {
          console.log(err);
          return response.json({error:"error al crear la tienda: " + err});
        }
        console.log("Tienda creada :: " + newTienda );
        return response.json( newTienda );
      });
    });
  }
};

