/**
 * ComisionController
 *
 * @description :: Server-side logic for managing Comisions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
module.exports = {

  getImagen:function(request, response){
    var file = request.allParams().imagen;
    //console.log( JSON.stringify(file) );
    var fileExt = file.substring(file.lastIndexOf(".") + 1 );
    console.log("Extension :: " + fileExt );
    console.log("Path to read :: " +  ImagenService.PATH_LOGO() + file );
    fs.readFile(ImagenService.PATH_LOGO() + "/" + file, function(err, data){
      response.writeHead(200, {'Content-Type': 'image/' + fileExt });
      response.end(data, 'binary');
    });
  },
  getImagenProducto:function( request, response ) {
    var data = request.allParams().data;
    //console.log( JSON.stringify(file) );
    var fileExt = data.imagen.substring(file.lastIndexOf(".") + 1 );
    console.log("Extension :: " + fileExt );
    console.log("Path to read :: " +  ImagenService.PATH_LOGO() + file );
    var path = ImagenService.PATH_LOGO()
    fs.readFile( + "/" + file, function(err, data){
      response.writeHead(200, {'Content-Type': 'image/' + fileExt });
      response.end(data, 'binary');
    });
  }

};

