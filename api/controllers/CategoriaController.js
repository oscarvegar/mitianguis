/**
 * MercanteController
 *
 * @description :: Server-side logic for managing Mercantes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	categoriasByTienda:function(req,res){
		var idTienda = req.allParams().id;
		Producto.find({tienda:idTienda},{fields: ['categorias']}).exec(function(err,data){
			console.log(data)
			var cats = []
			for(var i in data){
				cats = cats.concat(data[i].categorias)
			}
			cats = cats.filter(UtilService.onlyUnique).sort(function (a, b) {
			    return a.toLowerCase().localeCompare(b.toLowerCase());
			});
			return res.json(cats);
		})
	}
};

	