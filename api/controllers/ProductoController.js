/**
 * ProductoController
 *
 * @description :: Server-side logic for managing Productoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
		
	}
};

