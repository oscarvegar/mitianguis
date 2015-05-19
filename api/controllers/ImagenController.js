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
  getImagenProducto:function(request, response){
    var file = request.allParams().imagen;
    console.log( JSON.stringify(file) );
    var fileExt = file.substring(file.lastIndexOf(".") + 1 );
    console.log("Extension :: " + fileExt );
    console.log("Path to read :: " +  ImagenService.PATH_PRODUCTOS() + file );
    fs.readFile(ImagenService.PATH_PRODUCTOS() + "/" + file.replace("_", "/"), function(err, data){
      response.writeHead(200, {'Content-Type': 'image/' + fileExt });
      response.end(data, 'binary');
    });
  },
  getImagenSubProducto:function(request, response){
    var file = request.allParams().imagen;
    console.log( JSON.stringify(file) );
    var fileExt = file.substring(file.lastIndexOf(".") + 1 );
    console.log("Extension :: " + fileExt );
    console.log("Path to read :: " +  ImagenService.PATH_SUBPRODUCTOS() + file );
    fs.readFile(ImagenService.PATH_SUBPRODUCTOS() + "/" + file.replace("_", "/"), function(err, data){
      response.writeHead(200, {'Content-Type': 'image/' + fileExt });
      response.end(data, 'binary');
    });
  },
  getImagenPerfil:function(request, response){
    var file = request.allParams().imagen;
    console.log( JSON.stringify(file) );
    var fileExt = file.substring(file.lastIndexOf(".") + 1 );
    console.log("Extension :: " + fileExt );
    console.log("Path to read :: " +  ImagenService.PATH_PERFIL() + file );
    fs.readFile(ImagenService.PATH_PERFIL() + "/" + file.replace("_", "/"), function(err, data){
      response.writeHead(200, {'Content-Type': 'image/' + fileExt });
      response.end(data, 'binary');
    });
  },
  getImagenBlog:function(request, response){
    var file = request.allParams().imagen;
    console.log( JSON.stringify(file) );
    var fileExt = file.substring(file.lastIndexOf(".") + 1 );
    fs.readFile(ImagenService.PATH_BLOG() + "/" + file.replace("_", "/"), function(err, data){
      response.writeHead(200, {'Content-Type': 'image/' + fileExt });
      response.end(data, 'binary');
    });
  },

};

