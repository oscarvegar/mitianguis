/**
 * ProductoController
 *
 * @description :: Server-side logic for managing Productoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	productoPrincipalByMercante:function(req,res){
		console.log(req.allParams())
		res.json({code:"OK"})
	}
};
