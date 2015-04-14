/**
 * VentaController
 *
 * @description :: Server-side logic for managing Ventas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var unirest = require('unirest');
var fs = require('fs');

module.exports = {
	checkout:function(req,res){
		var orden = req.allParams();
		console.log(orden);

		var pago = {
	       "currency":"MXN",
	       "amount": 10000,
	       "description":"GAMELAND MITIANGUIS",
	       "reference_id":"9839-wolf_pack",
	       "card": orden.token,
	       "details": {
	         "email":orden.email
	       }
	     }

		unirest.post("https://api.conekta.io/charges")
		.auth({user: 'key_fK2GfyxqqvW1KJBxmxbqCw'})
		.headers({	'Accept': 'application/vnd.conekta-v0.3.0+json',
					'Content-type': 'application/json'})
		.send(pago)
		.end(function(response){
			console.log(response.body)
		})


		res.json(orden)
	},

	misVentas:function(request, response){
	    console.log("*************** CONSULTA MIS VENTAS **************");
	    var data = request.allParams();
	    
	    ProductosVenta.find().populate('producto').populate('venta').exec(function(err,productos){
	         return response.json(productos);
	    });

  }

};