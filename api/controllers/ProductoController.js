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
		Producto.find({tienda:idTienda,isPrincipal:true}).exec(function(err,data){
			//console.log(data)
			res.json(data)
		})
	},

  registraProducto:function(request, response){
    var producto = request.allParams();
    console.log("Producto a registrar :: " + producto );
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
    Producto.update(producto.update, producto.filtro).exec(function(err, productoUpdate){
      //console.log(productoUpdate);
      return response.json(productoUpdate);
    });
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

	productoByTienda:function(req,res){
		var idTienda = req.allParams().id;
		Producto.find({tienda:idTienda}).exec(function(err,data){
			console.log(data)
			res.json(data)
		});
	},

	findById:function(req,res){
		var idProducto = req.allParams().id;
		console.log("ID PRODUCTO >>>>>>",idProducto)
		Producto.findOne({id:idProducto}).exec(function(err,data){
			console.log(data)
			res.json(data);
		});
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

