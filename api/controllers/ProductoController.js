/**
 * ProductoController
 *
 * @description :: Server-side logic for managing Productoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var accounting = require('accounting');
module.exports = {

	productoPrincipalByTienda:function(req,res){
		var idTienda = req.allParams().id;
		Producto.find({tienda:idTienda,isPrincipal:true}).then(function(data){
			res.json(data)
		}).fail(function(err){
      console.log(err);
    })
	},

  registraProducto:function(request, response){
    var producto = request.allParams();
    Producto.create(producto).exec(function(err, productoNuevo){
      if(err){
        console.log(err);
        return response.json({error: "error al dar de alta el producto en la tienda: " + err});
      }
      //console.log(productoNuevo);
      return response.json(productoNuevo);
    });
  },

  actualizarProducto:function( request, response ){
    var producto = request.allParams();
    Producto.update({id:producto.id}, producto).exec(function(err, productoUpdate){
      //console.log(productoUpdate);
      return response.json(productoUpdate);
    });
  },

  borrarProducto: function( request, response ){
    var producto = request.allParams();
    Producto.update({id:producto.id},{status:StatusService.ELIMINADO})
      .then(function(result){
        return response.json(result);
      })
      .catch(function(err){
        console.err("Error al ");
        return response.json(500, {error:err});
      });
  },

  setImagenNoDisponible: function( request, response ){
    var data = request.allParams();

  },

  guardarArchivo: function( request, response ){
    var file = request.file('file') ;
    var infoProductos = JSON.parse(request.allParams().infoProductos);
    console.log("Params: " + JSON.stringify(infoProductos));
    var pathToSave = ImagenService.PATH_PRODUCTOS() + "/" + infoProductos.userId;
    if( infoProductos.tipoArchivo === "archivoPdf" ){
      pathToSave = ImagenService.PATH_ARCHIVO_PRODUCTOS() + "/" + infoProductos.userId;
    }
    file.upload({dirname: pathToSave},
      function (err, files) {
        var archivo = files[0];
        var indexDiag = archivo.fd.lastIndexOf("/");
        var nombreArchivo = archivo.fd.substring(indexDiag + 1);
        console.log("nombre de archivo:: " + nombreArchivo);
        if( infoProductos.tipoArchivo === "ImagenPrincipal" ){
          var pathArchivo = infoProductos.pathBase + "/getImagenProducto/" + infoProductos.userId + "_" + nombreArchivo;
          Producto.update({id:infoProductos.producto.id},{imagenPrincipal:pathArchivo})
            .exec(function(err, updateProd){
              return response.json(updateProd);
            });
        } else if (infoProductos.tipoArchivo === "archivoPdf") {
          var pathArchivo = infoProductos.pathBase + "/getArchivo/" + infoProductos.userId + "_" + nombreArchivo;
          var archivoPdfObj = {nombre:archivo.filename, url:pathArchivo};
          if(!infoProductos.producto.archivos){
            infoProductos.producto.archivos = [];
          }
          infoProductos.producto.archivos.push(archivoPdfObj);
          Producto.update({id:infoProductos.producto.id},{archivos:infoProductos.producto.archivos})
            .exec(function(err, updateProd){
              return response.json(updateProd);
            });
        } else {
          //console.log(">>>>>>>>>>>>>  cargando imagenes secundarias " );
          Producto.findOne({id:infoProductos.producto.id}).exec(function(err, prodFound){
            var pathArchivo = infoProductos.pathBase + "/getImagenProducto/" + infoProductos.userId + "_" + nombreArchivo;
            prodFound.imagenesSecundarias.push( pathArchivo );
            Producto.update({id:infoProductos.producto.id},{imagenesSecundarias:prodFound.imagenesSecundarias})
              .exec(function(err, updateProd){
                return response.json(updateProd);
              });
          });
        }

    });
  },

  productoByTiendaCategorias:function(req,res){
    var peticion = req.allParams();
    Producto.find({tienda:peticion.id,"$or": [
      {"categorias": peticion.categoria },
      {"categorias": "#PS4" }
    ]}).then(function(data){
      res.json(data)
    }).fail(function(err){
      console.log(err);
    });
  },

  carmbiarArchivo: function( request, response ){
    var file = request.file('file') ;
    var infoProductos = JSON.parse(request.allParams().infoProductos);
    console.log("Params: " + JSON.stringify(infoProductos));
    var pathToSave = ImagenService.PATH_PRODUCTOS() + "/" + infoProductos.userId;
    if( infoProductos.tipoArchivo === "archivoPdf" ){
      pathToSave = ImagenService.PATH_ARCHIVO_PRODUCTOS() + "/" + infoProductos.userId;
    }

    file.upload({dirname: pathToSave},
      function (err, files) {
        var archivo = files[0];
        var indexDiag = archivo.fd.lastIndexOf("/");
        var nombreArchivo = archivo.fd.substring(indexDiag + 1);
        console.log("nombre de archivo:: " + nombreArchivo);
        if (infoProductos.tipoArchivo === "archivoPdf") {
          var pathArchivo = infoProductos.pathBase + "/getArchivo/" + infoProductos.userId + "_" + nombreArchivo;
          var archivoPdfObj = {nombre:archivo.filename, url:pathArchivo};
          console.log("Indice ::: " + infoProductos.index  );
          if( infoProductos.index  != null && infoProductos.index >= 0 ) {
            console.log("reemplazando en posicion " + infoProductos.index);
            infoProductos.producto.archivos[infoProductos.index] = archivoPdfObj;
          }else {
            console.log("add archivo :(");
            infoProductos.producto.archivos.push(archivoPdfObj);
          }
          Producto.update({id:infoProductos.producto.id},{archivos:infoProductos.producto.archivos})
            .exec(function(err, updateProd){
              return response.json(updateProd);
            });
        } else {
          console.log(">>>>>>>>>>>>>  cargando imagenes secundarias " );
          Producto.findOne({id:infoProductos.producto.id}).exec(function(err, prodFound){
            var pathArchivo = infoProductos.pathBase + "/getImagenProducto/" + infoProductos.userId + "_" + nombreArchivo;
            if( infoProductos.index ) {
              prodFound.imagenesSecundarias[infoProductos.index] = pathArchivo;
            }else{
              prodFound.imagenesSecundarias.push(pathArchivo);
            }
            Producto.update({id:infoProductos.producto.id},{imagenesSecundarias:prodFound.imagenesSecundarias})
              .exec(function(err, updateProd){
                return response.json(updateProd);
              });
          });
        }

      });
  },

	productoByTienda:function(req,res){
		var idTienda = req.allParams().id;
		Producto.find({tienda:idTienda, status:StatusService.ACTIVO}).exec(function(err,data){
			res.json(data)
		});
	},

	findById:function(req,res){
		var idProducto = req.allParams().id;
    LOGS.info("ID PRODUCTO >>>>>> ",idProducto)
		Producto.findOne({id:idProducto}).populate('subproductos').then(function(data){
      if(data.subproductos && data.subproductos.length > 0){
        var subprods = [];
        for(var sub in data.subproductos){
          if( data.subproductos[sub].status === StatusService.ACTIVO ){
            subprods.push( data.subproductos[sub] );
          }
        }
        data.subproductos = subprods;
      }

			res.json(data);
		}).catch(function(err){
      console.log(err);
    });
	},

  actualizarSubProducto: function( request, response ){
    var subproducto = request.allParams();
    Subproducto.update({id:subproducto.id},subproducto).then(function(result){
      return response.json(result);
    }).catch(function(err){
      console.error(err);
      return response.json(500, err);
    });
  },

  createSubProducto: function( request, response ){
    var subproducto = request.allParams();
    Subproducto.create( subproducto).then( function(result){
      console.log(" SUBPRODUCTO CREADO >>> " + JSON.stringify(result) );
      return response.json( result );
    }).catch( function(err){
      console.error( err );
      return response.json(500, err);
    } );
  },

	share:function(req,res){
		var idProducto = req.allParams().id;
		console.log("ID PRODUCTO >>>>>>",idProducto)
		Producto.findOne({id:idProducto}).exec(function(err,data){
			if(!data){
				return res.view('404',{
    			producto: {},
    			redirectURL: ''
  			})
			}
			data.precioFormat = accounting.formatMoney(data.precio);
			return res.view('detalleProducto',{
    			producto: data,
    			redirectURL: '/store#/producto?p='+data.id
  			})
		});
	}
};

