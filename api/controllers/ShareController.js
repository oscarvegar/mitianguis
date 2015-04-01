/**
 * ShareControllerController
 *
 * @description :: Server-side logic for managing Sharecontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'shareP':function(req,res){
		var idP = req.allParams().id;
		console.log("ENTRAAAA")
		
		return res.view('detalleProducto',{
    		servervar: 'World?'
  		})
	}
};

