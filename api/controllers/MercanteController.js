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
      if( found ){
        console.log("Found :: " + JSON.stringify(found) );
            return response.json(found);
      }
      return response.send(404,{error:"El dominio " + data.urlMercante + " no existe... "});
    } );
  },
  findByUsuario:function(request, response){
    var data = request.allParams();
    console.log("Data for request find mercante::: " + JSON.stringify(data) );
    console.log("username: " + data.username);
    User.findOne({username:data.username}).exec(function(err,user){
      console.log("usuario encontrado >> " + user + "  :::: " + JSON.stringify(user));
      Mercante.findOne({usuario:user.id}).exec(function( err, found ){
        console.log("found mercante >> " + found );
        console.log("err mercante >> " + err );
        if(err)console.log(err);
        return response.json(found);
      });
    });
  }
};






