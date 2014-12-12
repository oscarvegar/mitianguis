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
    }
};

