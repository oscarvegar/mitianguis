/**
 * BlogController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	renderBlog : function(req,res){
		return res.view('homepage',{
			//producto: data,
			//redirectURL: '/#/blog'
		})
	},
	renderMain : function(req,res){
		return res.view('homepage',{
			blog: {titulo:"RayBan y su legado en la historia",
					preview:"RayBan ha sido por excelencia la marca de gafas con mayor favoritismo en la historia, pero realmente conoces su origen?",
					imagen:"http://gameland.mitianguis.mx/getImagenSubProducto/555684d67d1de57622689628_9d2e3199-3f56-4819-9c0d-a99b82b826bb.png"
				},
			redirectURL: '/#/blog'
		})
	}
};

