/**
 * VentaController
 *
 * @description :: Server-side logic for managing Ventas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Q = require("q");
var unirest = require('unirest');
var fs = require('fs');

module.exports = {
	checkout:function(req,res){
		var orden = req.allParams();
		console.log(orden);
		orden.colonia = orden.selColonia.d_asenta;
		orden.municipio = orden.selColonia.D_mnpio;
		orden.ciudad = orden.selColonia.d_ciudad;
		orden.estado = orden.selColonia.d_estado;

		var carrito = orden.carrito;

		//console.log("CARRITO >>>>>",carrito.productosCarrito)
		delete orden.selColonia;
		delete orden.carrito;
		orden.totalVenta =0.0;
		orden.productosVenta = [];
		var promises = [];
		for(var i in carrito.productosCarrito){
			promises.push(
				Producto.findOne({id:carrito.productosCarrito[i].producto.id}).populate('subproductos')
			);
		}
		Q.all(promises)
		.allSettled(promises).then(function(results) {
			for(var i in results){
				var producto = results[i].value;
				if(producto.subproductos && producto.subproductos.length>0){
					for(var j in producto.subproductos){
						if(producto.subproductos[j].id === carrito.productosCarrito[i].producto.modeloSelected.id){
							var obj = {
								producto:producto,
								precioVenta:producto.subproductos[j].precio,
								cantidad:carrito.productosCarrito[i].cantidad,
								modeloSelected:producto.subproductos[j].id
							}
							obj.subtotal=obj.cantidad*obj.precioVenta,
							orden.productosVenta.push(obj);
							orden.totalVenta += obj.subtotal
							break;
						}
					}
				}else{
					var obj = {
						producto:producto,
						precioVenta:producto.precio,
						cantidad:carrito.productosCarrito[i].cantidad
					}
					obj.subtotal=obj.cantidad*obj.precioVenta,
					orden.productosVenta.push(obj);
					orden.totalVenta += obj.subtotal
				}
			}
			console.log("TOTAL VENTA >>>>>",orden.totalVenta);
			//console.log("ORDEN >>>>>",orden)
			var productosVenta = orden.productosVenta;
			delete orden.productosVenta;
			delete orden.id;
			var ventaData;
			orden.status = 0;
			Venta.create(orden).exec(function(err,venta){
				ventaData = venta;
				for(var i in productosVenta){
					productosVenta[i].producto = productosVenta[i].producto.id;
					productosVenta[i].venta = venta;
				}
				ProductosVenta.create(productosVenta).then(function(prodsVenta){

				console.log("PRODUCTOS VENTA >>>>>",prodsVenta)
					var pago = {
				       	"currency":"MXN",
				       	"amount": venta.totalVenta,
				       	"description":"GAMELAND MITIANGUIS",
				       	"reference_id":venta.id,
				       	"card": venta.conektaToken,
				       	"details": {
			         		"email":venta.email
				       	}
			     	}
			     	console.log("PAGO >>>>>",pago);
			     	unirest.post("https://api.conekta.io/charges")
					.auth({user: 'key_fK2GfyxqqvW1KJBxmxbqCw'})
					.headers({	'Accept': 'application/vnd.conekta-v0.3.0+json',
								'Content-type': 'application/json'})
					.send(pago)
					.end(function(response){
						console.log("SALVANDO LA VENTA!!!!!!!!!!!!!!!!!")
						venta.conektaInfo = response.body;
						venta.save();
						res.json({code:1})
					})
				}).catch(function(err){
					console.log("XXXXXXXXXXX DELETING PROD VENTAS XXXXXXXXXXXXX")
					ProductosVenta.destroy({venta:ventaData.id}).then();
					venta.destroy();
					res.json(500,{code:-20,msg:"Error al guardar el detalle de la venta"})
				})
			})
			
			
	    	
	  	}).catch(function(err,err2){
	  		console.log(err)
	  		console.log(err2)
	  	});
	},
	buscarDatosByEmail:function(req,res){
		var email = req.allParams().id;
		console.log(email)
		User.findOne({username:email}).exec(function(err,user){
			console.log(user)
      		if(!user)return res.json(404,{code:-1,msg:"Usuario no encontrado"});
      		Venta.find({cliente:user},{sort: 'createdAt DESC'}).exec(function(err,ventas){
  				console.log(ventas);
  				if(ventas.length==0)return res.json(404,{code:-2,msg:"Ventas no encontradas"});

  				return res.json(ventas[0]);
      		})

	    });
	},
		misVentas:function(request, response){
	    console.log("*************** CONSULTA MIS VENTAS **************");
	    var data = request.allParams();
	    
	    ProductosVenta.find().populate('producto').populate('venta').exec(function(err,productos){
	         return response.json(productos);
	    });

  }

};