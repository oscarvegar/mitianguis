/**
 * BlogController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	renderBlog : function(req,res){
		Blog.findOneById(req.allParams().id).then(function(blog){
			return res.view('homepage',{
				blog:blog,
				redirectURL: '/blog'
			})
		}).fail(function(err){
			LOGS.error(err);
			res.send(500)
		})
		
	},
	renderMain : function(req,res){
		return res.view('homepage',{
			blog: {titulo:"RayBan y su legado en la historia",
					resumen:"RayBan ha sido por excelencia la marca de gafas con mayor favoritismo en la historia, pero realmente conoces su origen?",
					imagen:"http://gameland.mitianguis.mx/getImagenSubProducto/555684d67d1de57622689628_9d2e3199-3f56-4819-9c0d-a99b82b826bb.png"
				},
			redirectURL: '/blog'
		})
	},
	crear : function(req,res){
		var blog = req.allParams();
		blog.user = req.session.currentUser;
		console.info("CREAR BLOG",blog)
		if(!blog.id){
			Blog.create(blog).then(function(blog){
				return res.json(blog)
			}).fail(function(err){
				LOGS.error(err);
			})
		}else{
			blog.user = req.session.currentUser.id;
			Blog.update({id:blog.id},blog).then(function(blog){
				return res.json(blog)
			}).fail(function(err){
				LOGS.error(err);
			})
		}
	},
	upload: function(req,res){ 
		var file = req.file('file') ;

		file.upload({dirname: ImagenService.PATH_BLOG()}, function (err, files) {  
			console.log("ERR",err);
			files = files[0];
			console.log(files)
			console.log(files.filename)
			files.filename = files.fd.substring(files.fd.lastIndexOf("/") + 1 );
			delete files.fd;
			return res.json(files)
 		});
		
	},
	all: function(req,res){
		console.info("VIENE POR LOS BLOGS")
		Blog.find().then(function(blogs){ 
			return res.json(blogs);
		}).fail(function(err){
			LOGS.err(err);
			res.json(500,{msg:err});
		})
	},
	findById:function(req,res){
		Blog.findOneById(req.allParams().id).then(function(blog){
			return res.json(blog);
		}).fail(function(err){
			LOGS.error(err);
			res.send(500)
		})
	}
};

