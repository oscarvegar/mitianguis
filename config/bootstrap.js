/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var moment = require('moment');
module.exports.bootstrap = function(cb) {

    Mercante.findOne({codigoMercante:'24201314227'}).exec(function(err,found){
        if(err){return res.json(400,err)}
        if(found == null){
            var newMer = {}
            //newMer.id = "54840ad65c75f70000a5e879";
            newMer.name="SYSTEM";
            newMer.tipo=-2000;
            newMer.codigoMercante="24201314227";
            newMer.mentor = -1;
            newMer.diaInscripcion =0;
            newMer.urlMercante="store";
            //newMer.password="system-main-43289";
            User.create({username:'system@mitianguis.com', email:'system@mitianguis.com', password:'system-main-43289'})
            .exec( function(err, userCreated){
            	newMer.usuario = userCreated;
            	Mercante.create(newMer).exec(function(err,created){
            		if(err){return console.log(err)}
	                console.log(created)
	                Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:created})
	                .exec(function(err,cCar){
	                	console.log(cCar);
                        Parametro.create({datosSystem:{systemId:created.id,carteraId:cCar.id}})
                        .exec(function(err,cParam){
                        	console.log(cParam);
                         });
                        
                        User.create({username:'oscarv@mitianguis.com', email:'oscarv@mitianguis.com', password:'oscarv'})
                        .exec( function(err, userNew){
                        	Mercante.create({nombre:'Oscar',apellidoPaterno:'Vega',apellidoMaterno:'Rodríguez', mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARVEGAR', diaInscripcion:moment().date(),urlMercante:"oscarvegar",usuario:userNew})
	                        .exec(function(err,createdMerc){
	                             console.log(createdMerc); 
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });
	                         });
                        });
                        
                        User.create({username:'danielm@mitianguis.com', email:'danielm@mitianguis.com', password:'danielm'})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Jose Daniel',apellidoPaterno:'Morales',apellidoMaterno:'Ríos', mentor:created,fechaNacimiento:moment('1981 05 15').toDate(),codigoMercante:'DANIMORALES',diaInscripcion:moment().date(),urlMercante:"danistore",usuario:userNew})
	                         .exec(function(err,createdMerc){
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });                   
	                         });
                        });
                        
                        User.create({username:'oscarg@mitianguis.com', email:'oscarg@mitianguis.com', password:'oscarg'})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Oscar',apellidoPaterno:'García',apellidoMaterno:'Pacheco', mentor:created,fechaNacimiento:moment('1981 08 21').toDate(),codigoMercante:'OSCARGARCIA',diaInscripcion:moment().date(),urlMercante:"oscarstore", usuario:userNew})
	                         .exec(function(err,createdMerc){
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });                   
	                         });
                        });
                        
                        User.create({username:'oscarm@mitianguis.com', email:'oscarm@miianguis.com', password:'oscarm'})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Oscar',apellidoPaterno:'Monroy',apellidoMaterno:'Unknown', mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARMONROY',diaInscripcion:moment().date(),urlMercante:"oscarmonstore", usuario:userNew})
	                         .exec(function(err,createdMerc){
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });                   
	                         });
                        });
                     });
                 }); 
            });
        }
    });

    Parametro.findOne({llave:'MENSUALIDAD'}).exec(function(err,found){
        if(!found)
            Parametro.create({llave:'MENSUALIDAD',valor:198}).exec(function(err,cParam){
                console.log(cParam);                   
            });
    });

    // Creando las categorias basicas
    var cat1 = {_id: 1, nombre:"Electronica", descripcion:"Articulos electronicos", subcategoria:null, clicks:0};
    var cat2 = {_id: 2, nombre:"Moda", descripcion:"Articulos de moda", subcategoria:null, clicks:0};
    var cat3 = {_id: 3, nombre:"Hogar", descripcion:"Articulos para el hogar", subcategoria:null, clicks:0};
    var cat4 = {_id: 4, nombre:"Zapatos", descripcion:"Articulos para el calzado", subcategoria:null, clicks:0};
    var cat5 = {_id: 5, nombre:"Joyeria y Relojes", descripcion:"Articulos de joyeria y relojes", subcategoria:null, clicks:0};
    var cat6 = {_id: 6, nombre:"Salud y Belleza", descripcion:"Articulos para tu salud", subcategoria:null, clicks:0};
    var cat7 = {_id: 7, nombre:"Deportes", descripcion:"Articulos para Deportes", subcategoria:null, clicks:0};
    
    var cat8 =  {_id: 100, nombre:"Celulares", descripcion:"", subcategoria:1, clicks:0};
    var cat9 =  {_id: 101, nombre:"Tablets", descripcion:"", subcategoria:1, clicks:0};
    var cat10 = {_id: 102, nombre:"Videocámaras", descripcion:"", subcategoria:1, clicks:0};
    var cat11 = {_id: 103, nombre:"Videojuegos", descripcion:"", subcategoria:1, clicks:0};
    
    var cat12 = {_id: 200, nombre:"Vestidos", descripcion:"", subcategoria:2, clicks:0};
    var cat13 = {_id: 201, nombre:"Blusas", descripcion:"", subcategoria:2, clicks:0};
    var cat14 = {_id: 202, nombre:"Camisas", descripcion:"", subcategoria:2, clicks:0};
    var cat15 = {_id: 203, nombre:"Pantalones", descripcion:"", subcategoria:2, clicks:0};
    
    var cat16 = {_id: 300, nombre:"Decoracion", descripcion:"", subcategoria:3, clicks:0};
    var cat17 = {_id: 301, nombre:"Baño", descripcion:"", subcategoria:3, clicks:0};
    var cat18 = {_id: 302, nombre:"Jardin", descripcion:"", subcategoria:3, clicks:0};
    var cat19 = {_id: 303, nombre:"Cocina", descripcion:"", subcategoria:3, clicks:0};
    
    var cat20 = {_id: 400, nombre:"Deportivos", descripcion:"", subcategoria:4, clicks:0};
    var cat21 = {_id: 401, nombre:"Sandalias", descripcion:"", subcategoria:4, clicks:0};
    var cat22 = {_id: 402, nombre:"Mocasines", descripcion:"", subcategoria:4, clicks:0};
    var cat23 = {_id: 403, nombre:"Botas", descripcion:"", subcategoria:4, clicks:0};
    
    var cat24 = {_id: 700, nombre:"Futbol", descripcion:"", subcategoria:7, clicks:0};
    var cat25 = {_id: 701, nombre:"Baloncesto", descripcion:"", subcategoria:7, clicks:0};
    var cat26 = {_id: 702, nombre:"Golf", descripcion:"", subcategoria:7, clicks:0};
    var cat27 = {_id: 703, nombre:"Tenis", descripcion:"", subcategoria:7, clicks:0};
    
    var categorias = [ cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9, cat10,
                       cat11, cat12, cat13, cat14, cat15, cat16, cat17, cat18, cat19, cat20,
                       cat21, cat22, cat23, cat24, cat25, cat26, cat27];
    
    Categoria.find().exec(function(err,found){
        if(err){return res.json(400,err)}
        if(found == null || found.length == 0){
            Categoria.create(categorias)
            .exec(function(err,cCat){});   
        }
    });
    
    
    
    
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
