/**
 * DireccionController
 *
 * @description :: Server-side logic for managing Direccions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
		var cp = parseInt(req.allParams().id);
		console.log(cp) 
		Direccion.find({d_codigo:cp}).exec(function(err,data){
			console.log(err)
			console.log(data)
			res.json(data);
		});
	}
};

