/**
 * ComisionController
 *
 * @description :: Server-side logic for managing Comisions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getImagen:function(request, response){
    var file = request.allParams().imagen;
    //console.log( JSON.stringify(file) );
    var fileExt = file.substring(file.lastIndexOf(".") + 1 );
    fs.readFile("/opt/resources/oneticketpoint/imagenes/logo/" + file, function(err, data){
      response.writeHead(200, {'Content-Type': 'image/'+fileExt });
      response.end(data, 'binary');
    });
  }

};

