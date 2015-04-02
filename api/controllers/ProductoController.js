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
			console.log(data)
			res.json(data)
		})
		
	},

	productoByTienda:function(req,res){
		var idTienda = req.allParams().id;
		Producto.find({tienda:idTienda}).exec(function(err,data){
			console.log(data)
			res.json(data)
		})
		
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

