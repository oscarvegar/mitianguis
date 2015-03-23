/**
 * MercanteController
 *
 * @description :: Server-side logic for managing Mercantes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	categoriasMenu:function(req,res){
		Categoria.find({subcategoria:null}).sort({clicks:-1}).limit(5).exec(function(err,found){
            return res.json(found);
        });
    }
};

	