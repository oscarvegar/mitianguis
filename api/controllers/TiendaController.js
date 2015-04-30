/**
 * TiendaController
 *
 * @description :: Server-side logic for managing Tiendas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');
module.exports = {
  index:function(req,res){
   var prod = req.param('prod');
   if(prod){
      Producto.findOne({id:prod}).then(function(producto){
        producto.precioFormat = require('accounting').formatMoney(producto.precio);
        res.view('homepage',{producto:producto,redirectURL: '/store#/producto?p='+producto.id});
      });
   }else{
      res.view('homepage')
   }
  },
  proxy:function(req,res){
    console.log("PROXY")
    res.view('proxy',{layout:'layoutProxy'})
  },
  setStatus: function(request, response){
    var data = request.allParams();
    console.log("set Estatus :: " + JSON.stringify(data) );
    Tienda.update({id: data.tienda.id},{status:data.status}).exec(function(err, updateTienda){
      return response.json(updateTienda);
    });
  },
	findByMercante:function(request, response){
    var data = request.allParams().id;
    console.log( JSON.stringify(data) );
    Tienda.find({mercante:data, status:1}).exec(function(err, found){
      console.log( "tiendas encontradas:: " + JSON.stringify(found) );
      return response.json( found );
    });
  },
  create:function(request, response){
    var tienda = request.allParams().tienda;
    var data = null;
    if( tienda ){
      data = JSON.parse(tienda);
      var file = request.file('file') ;
      console.log(JSON.stringify(data));
      console.log("PATH to Save   :: " + ImagenService.PATH_LOGO());
      file.upload({dirname: ImagenService.PATH_LOGO()}, function (err, files) {
        var archivo = files[0];
        var indexDiag = archivo.fd.lastIndexOf("/");
        var nombreArchivo = archivo.fd.substring(indexDiag + 1);
        console.log("nombre de archivo:: " + nombreArchivo);
        data.logo += "/getImagen/" + nombreArchivo;
        Tienda.create(data).exec(function (err, newTienda) {
          if (err) {
            console.log(err);
            return response.json({error: "error al crear la tienda: " + err});
          }
          //console.log("Tienda creada :: " + newTienda);
          return response.json(newTienda);
        });
      });
    } else {
      data = request.allParams();
      data.logo += "/getImagen/" + ImagenService.IMAGE_NOT_FOUND;
      Tienda.create(data).exec(function (err, newTienda) {
        if (err) {
          console.log(err);
          return response.json({error: "error al crear la tienda: " + err});
        }
        //console.log("Tienda creada :: " + newTienda);
        return response.json(newTienda);
      });
    }
  },
  editar:function(request, response){
    console.log("***************  ACTUALIZANDO INFO TIENDA **************");
    var tienda = request.allParams().tienda;
    var data = null;
    if( tienda ){
      data = JSON.parse(tienda);
      var file = request.file('file') ;
      console.log(JSON.stringify(data));
      console.log("PATH to Save   :: " + ImagenService.PATH_LOGO());
      file.upload({dirname: ImagenService.PATH_LOGO()}, function (err, files) {
        var archivo = files[0];
        var indexDiag = archivo.fd.lastIndexOf("/");
        var nombreArchivo = archivo.fd.substring(indexDiag + 1);
        console.log("nombre de archivo:: " + nombreArchivo);
        data.logo = nombreArchivo;
        Tienda.update({id:data.id},data).exec(function (err, newTienda) {
          if (err) {
            console.log(err);
            return response.json({error: "error al actualizas la tienda: " + err});
          }
          //console.log("Tienda actualizada :: " + newTienda);
          return response.json(newTienda);
        });
      });
    } else {
      data = request.allParams();
      Tienda.update({id:data.id},data).exec(function (err, newTienda) {
        if (err) {
          console.log(err);
          return response.json({error: "error al actrualizar la tienda: " + err});
        }
        //console.log("Tienda actualizada :: " + newTienda);
        return response.json(newTienda);
      });
    }
  }
};

