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
var moment = require('moment'),
	MongoClient = require('mongodb').MongoClient

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
            //newMer.urlMercante="store";
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
                        	Mercante.create({nombre:'Oscar',apellidoPaterno:'Vega',apellidoMaterno:'Rodríguez', mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARVEGAR', diaInscripcion:moment().date(),usuario:userNew})
	                        .exec(function(err,createdMerc){
	                             console.log(createdMerc); 
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });
                                 Tienda.create({
                                    nombre:'Gameland',
                                    descripcion:'Tienda de videojuegos',
                                    url : "gameland",
                                    mercante:createdMerc,
                                    certificado:0,
                                    visitas:0,
                                    likes:0,
                                    facebook:"facebook.com/oscarvegaro",
                                    twitter:'@oscarvegar',
                                    youtube:null
                                }).exec(function(err,newTienda){
                                    var productos = [{
                                            nombre:"Grand Theaft Auto V",
                                            descripcion:"<div>Vendo precioso GTA V<br><br><h1>MUY CHIDO!</h1><div>",
                                            stock:10,
                                            sku:null,
                                            precio:600.00,
                                            precioMayoreo:null,
                                            cantidadMayoreo:null,
                                            infoExtra:'Buen estado con caja e instructivo.', //Ej. Tallas de ropa, capacidad, etc, etc
                                            costoEnvio:100.00,
                                            garantia:'1 mes',
                                            status:1, //-1:eliminado,0:inactivo,1:activo
                                            imagenesSecundarias: ['http://www.adslzone.net/app/uploads/2014/05/protagonistas-de-a-historia-GTA-V.jpg','http://media.edge-online.com/wp-content/uploads/sites/117/2013/12/GTAV-610x343.jpg'], //strings de urls ['url1','url2']
                                            imagenPrincipal:'http://elmanana.com.mx/imgs/noticias/original/bc5474fedb11d94_80982f56572768b91d2186ac130995e3',
                                            visitas:0,
                                            ratings:[{stars:5,comentario:"MUY BUEN VENDEDOR"},{stars:4,comentario:"Bueno pero tardó el envío"}], //[{stars:int,comentario:string}]
                                            categorias:['#videojuegos','#gtav',"#ps3","#xbox360"],
                                            isPrincipal:true,
                                            youtube:'https://www.youtube.com/watch?v=kxHa0k_kTnM',
                                            tienda:newTienda
                                        },{
                                            nombre:"Beats Studio 2.0",
                                            descripcion:"<div>Vendo audifonos Beats 2.0 de Dr Dre<br><br><h1>BARA BARA!</h1><div>",
                                            stock:10,
                                            sku:null,
                                            precio:3600.00,
                                            precioMayoreo:3,
                                            cantidadMayoreo:3000.00,
                                            infoExtra:'Bluetooth, recargables.', //Ej. Tallas de ropa, capacidad, etc, etc
                                            costoEnvio:150.00,
                                            garantia:'3 meses',
                                            status:1, //-1:eliminado,0:inactivo,1:activo
                                            imagenesSecundarias: ['http://www1.pcmag.com/media/images/412497-beats-by-dr-dre-studio.jpg?thumb=y','http://brain-images.cdn.dixons.com/4/4/21660644/l_21660644.jpg'], //strings de urls ['url1','url2']
                                            imagenPrincipal:'http://ebbob.com/img/01/iixjz0f4h2e.jpg',
                                            visitas:0,
                                            ratings:[{stars:5,comentario:"MUY BUEN VENDEDOR"},{stars:4,comentario:"Bueno pero tardó el envío"}], //[{stars:int,comentario:string}]
                                            categorias:['#audifonos','#beats',"#DrDre","#Audio",'#Electrónica'],
                                            isPrincipal:true,
                                            youtube:'https://www.youtube.com/watch?v=xlljElC0ehg',
                                            tienda:newTienda
                                        },{
                                            nombre:"Consola PS4",
                                            descripcion:"<div>Vendo consola PS4, con un control, sellada<br><br><h1>LLevele Llévele!</h1><div>",
                                            stock:5,
                                            sku:null,
                                            precio:6000.00,
                                            infoExtra:'Totalmente nuevo, en su caja sellado.', //Ej. Tallas de ropa, capacidad, etc, etc
                                            costoEnvio:500.00,
                                            garantia:'1 Año',
                                            status:1, //-1:eliminado,0:inactivo,1:activo
                                            imagenesSecundarias: ['http://static1.gamespot.com/uploads/original/1535/15354745/2819663-8418826320-28191.jpg','http://www.extremetech.com/wp-content/uploads/2013/06/ps4-rhombox-cropped.jpg'], //strings de urls ['url1','url2']
                                            imagenPrincipal:'http://genk2.vcmedia.vn/DlBlzccccccccccccE5CT3hqq3xN9o/Image/2014/02/1-05805.jpg',
                                            visitas:0, //[{stars:int,comentario:string}]
                                            categorias:['#PS4','#Electronica',"#Consolas","#Videojuegos"],
                                            isPrincipal:false,
                                            youtube:'https://www.youtube.com/watch?v=ZkE3gr5EDs0',
                                            tienda:newTienda
                                        }];
                                    Producto.create(productos).exec(function(err,productos){
                                        console.log(productos);
                                    });  
                                    createdMerc.tiendas = [newTienda];
                                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AQUI ESTA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                                    createdMerc.save(console.log);
                                });
	                         });
                        });
                        
                        User.create({username:'danielm@mitianguis.com', email:'danielm@mitianguis.com', password:'danielm'})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Jose Daniel',apellidoPaterno:'Morales',apellidoMaterno:'Ríos', mentor:created,fechaNacimiento:moment('1981 05 15').toDate(),codigoMercante:'DANIMORALES',diaInscripcion:moment().date(),usuario:userNew})
	                         .exec(function(err,createdMerc){
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });                   
	                         });
                        });
                        
                        User.create({username:'oscarg@mitianguis.com', email:'oscarg@mitianguis.com', password:'oscarg'})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Oscar',apellidoPaterno:'García',apellidoMaterno:'Pacheco', mentor:created,fechaNacimiento:moment('1981 08 21').toDate(),codigoMercante:'OSCARGARCIA',diaInscripcion:moment().date(), usuario:userNew})
	                         .exec(function(err,createdMerc){
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);
	
	                             });                   
	                         });
                        });
                        
                        User.create({username:'oscarm@mitianguis.com', email:'oscarm@miianguis.com', password:'oscarm'})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Oscar',apellidoPaterno:'Monroy',apellidoMaterno:'Unknown', mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARMONROY',diaInscripcion:moment().date(), usuario:userNew})
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
    
    
    
   
    
 /* Generando los constraints en MongoDB
    var url = 'mongodb://localhost:27017/dev_mitianguis';
    MongoClient.connect(url, function(err, db) {
    	console.log("Connected correctly to server");
    	var collection = db.collection('mercante');
    	collection.createIndex({ "urlMercante": 1 }, { unique: true }, function(err, results){
    		db.close();
    	} );
    });*/

//GENERANDO PRODUCTOS POR DEFAULT PARA UN MERCANTE


    
    
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
