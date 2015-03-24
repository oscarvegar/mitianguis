/**
 * MercanteController
 *
 * @description :: Server-side logic for managing Mercantes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find:function(req,res){
        Mercante.find().populateAll().exec(function(err,found){
            return res.json(found);
        });
    },
    findByUrlMercante:function(request, response){
    	var data = request.allParams();
    	//console.log("Data for request find mercante::: " + data + "--" + JSON.stringify(data) );
    	Tienda.findOne({url:data.urlMercante}).populate('mercante').exec( function(err, found){
    		if(err){return response.json(400,err)}
    		console.log("Found :: " + JSON.stringify(found) );
            return response.json(found.mercante);
    	} );
    }
};






