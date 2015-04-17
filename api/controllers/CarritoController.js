/**
 * CarritoController
 *en
 * @description :: Server-side logic for managing Carritoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Q = require("q");
module.exports = {
	current:function(req,res){
		var currentUser = req.session.currentUser;
    var tienda = req.allParams().id;
    Carrito.findOne({tienda:tienda,cliente:currentUser.id}).populate('productosCarrito').then(function(carrito){
      if(carrito){
        if(carrito.productosCarrito.length>0){
          var prodCar = []
          for(var i in carrito.productosCarrito){
            if(carrito.productosCarrito[i].producto) {
              prodCar.push(
                Producto.findOne({id: carrito.productosCarrito[i].producto}).populate('subproductos')
              )
            }

          }
          Q.all(prodCar).allSettled(prodCar).then(function(productosRes){
            for(var i in carrito.productosCarrito) {
              for(var j in productosRes){
                if(carrito.productosCarrito[i].producto == productosRes[j].value.id){
                  carrito.productosCarrito[i].producto = productosRes[j].value;
                }
              }
            }
            return res.json(carrito);
          })
        }else{
          return res.json(carrito);

        }

      }else{
        return res.json(carrito);
      }
    }).catch(function(err){
      sails.log.error(err)
      return res.json(500,"ERROR EN SERVIDOR")
    });
	},
  create:function(req,res){
    var tienda = req.allParams().id;
    var currentUser = req.session.currentUser;
    if(currentUser)
      Carrito.create({tienda:tienda,cliente:currentUser.id}).then(function(data){
        data.preguntas = [];
        console.log("CARRITO CREADO > > > > > > > > >",data)
        res.json(data);
      })
    else
      Carrito.create({tienda:tienda}).then(function(data){
        data.preguntas = [];
        console.log("CARRITO CREADO > > > > > > > > >",data)
        res.json(data);
      })
  },
  update:function(req,res){
    var carrito = req.allParams();
    for(var i in carrito.productosCarrito){
      carrito.productosCarrito[i].producto = carrito.productosCarrito[i].producto.id;
    }
    Carrito.update({id:carrito.id},carrito).then(function(data){
      console.log(data)
      return res.json(data);
    }).catch(function(err){
      console.log(err)
      return res.json(500,"ERROR EN SERVIDOR")
    })
  },
  agregarPregunta:function(req,res){
    var data = req.allParams();
    Carrito.findOne({id:data.id}).then(function(carrito){
      carrito.preguntas.unshift({contenido:data.contenido,creador:'Cliente',createdAt:new Date()})
      carrito.save();
      return res.json(carrito);
    })
  }
};

