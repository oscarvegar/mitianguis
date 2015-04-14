/**
 * VentaController
 *
 * @description :: Server-side logic for managing Ventas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Q = require("q");
var unirest = require('unirest');
module.exports = {
	checkout:function(req,res){
		var orden = req.allParams();
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
				Producto.findOne({id:carrito.productosCarrito[i].producto.id})
			);
		}
		Q.all(promises)
		.allSettled(promises).then(function(results) {
			for(var i in results){
				var producto = results[i].value;
				var obj = {
					producto:producto,
					precioVenta:producto.precio,
					cantidad:carrito.productosCarrito[i].cantidad
				}
				obj.subtotal=obj.cantidad*obj.precioVenta,
				orden.productosVenta.push(obj);
				orden.totalVenta += obj.subtotal
			}
			console.log("TOTAL VENTA >>>>>",orden.totalVenta);
			console.log("ORDEN >>>>>",orden)
			var productosVenta = orden.productosVenta;
			delete orden.productosVenta;
			delete orden.id;
			var ventaData;
			Venta.create(orden).then(function(venta){
				ventaData = venta;
				for(var i in productosVenta){
					productosVenta[i].producto = productosVenta[i].producto.id;
					productosVenta[i].venta = venta;
				}
				ProductosVenta.create(productosVenta).then(function(prodsVenta){
					hola();
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
						venta.conektaInfo = response.body;
						venta.save();
						res.json({code:1})
					}).catch(function(err){
						ProductosVenta.destroy({venta:ventaData.id}).then();
						venta.destroy();
						res.json(500,{code:-10,msg:"Error al pasar la transacción"})
					})
				}).catch(function(err){
					console.log("XXXXXXXXXXX DELETING PROD VENTAS XXXXXXXXXXXXX")
					ProductosVenta.destroy({venta:ventaData.id}).then();
					venta.destroy();
					res.json(500,{code:-20,msg:"Error al guardar el detalle de la venta"})
				})
			}).catch(function(err){
					console.log("XXXXXXXXXXX DELETING VENTAS XXXXXXXXXXXXX")
					ventaData.destroy()
					res.json(500,{code:-20,msg:"Error al guardar la venta"})
					
			})
			
			
	    	
	  	});

		

		

		/*Venta.create(orden).exec(function(venta){
			console.log("VENTA >>>>>",venta)
		})*/

		

		


		
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
	}
};