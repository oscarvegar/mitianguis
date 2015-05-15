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
	MongoClient = require('mongodb').MongoClient;

module.exports.bootstrap = function(cb) {

    Mercante.findOne({codigoMercante:'24201314227'}).exec(function(err,found){
        if(err){return res.json(400,err)}
        if(found == null){
            var newMer = {};
            //newMer.id = "54840ad65c75f70000a5e879";
            newMer.name="SYSTEM";
            newMer.tipo=-2000;
            newMer.codigoMercante="24201314227";
            newMer.mentor = -1;
            newMer.diaInscripcion =0;
            //newMer.urlMercante="pages";
            //newMer.password="system-main-43289";
            User.create({username:'system@mitianguis.com', email:'system@mitianguis.com', password:'system-main-43289'})
            .exec( function(err, userCreated){
            	newMer.usuario = userCreated;
            	Mercante.create(newMer).exec(function(err,created){
            		if(err){return console.log(err)}
	                console.log(created);
	                Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:created})
	                .exec(function(err,cCar){
	                	console.log(cCar);
                        Parametro.create({datosSystem:{systemId:created.id,carteraId:cCar.id}})
                        .exec(function(err,cParam){
                        	console.log(cParam);
                         });

                        User.create({username:'oscarv@mitianguis.com', email:'oscarvegar@gmail.com', password:'oscarv',perfil:'MERCANTE', verificacion:1})
                        .exec( function(err, userNew){
                        	Mercante.create({nombre:'Oscar',apellidoPaterno:'Vega',apellidoMaterno:'Rodríguez', mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARVEGAR', diaInscripcion:moment().date(),usuario:userNew})
	                        .exec(function(err,createdMerc){
	                             console.log(createdMerc);
                              ConektaToken.create({ conektaToken: 'tok_test_card_declined', creditDebitCardMask: 'XXXX-XXXX-XXXX-0002', financialServiceBrand: 'MASTERCARD', mercante: createdMerc }).exec(function(err,cCon) {
                                console.log(cCon);
                                Mercante.update({id: cCon.mercante}, {conektaToken: cCon}).exec(function(err, uMer) {
                                  console.log(uMer);
                                });
                              });
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
                                    status:1,
                                    logo:'../../imagenes/noimageavailable.png',
                                    facebook:"facebook.com/oscarvegaro",
                                    twitter:'@oscarvegar',
                                    youtube:null
                                }).exec(function(err,newTienda){
                                    var productos = [{
                                            nombre:"Grand Theaft Auto V",
                                            descripcion:"<div>Vendo precioso GTA V<br><br><h1>MUY CHIDO!</h1><div>",
                                            descripcionCorta:"Grand Theft Auto V, en buen estado",
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
                                            subproductos:[{modelo:"online", imagen:"http://oyster.ignimgs.com/mediawiki/apis.ign.com/grand-theft-auto-5/thumb/7/79/GTA-Online.jpg/468px-GTA-Online.jpg", precio:110.0, stock:10},
                                              {modelo:"xobox", imagen:"http://ecx.images-amazon.com/images/I/61gWiG%2BN7PL.jpg", precio:100.0, stock:5}],
                                            ratings:[{stars:5,comentario:"MUY BUEN VENDEDOR"},{stars:4,comentario:"Bueno pero tardó el envío"}], //[{stars:int,comentario:string}]
                                            categorias:['#videojuegos','#gtav',"#ps3","#xbox360"],
                                            isPrincipal:true,
                                            youtube:'https://www.youtube.com/watch?v=kxHa0k_kTnM',
                                            tienda:newTienda
                                        },{
                                            nombre:"Beats Studio 2.0",
                                            descripcion:"<div>Vendo audifonos Beats 2.0 de Dr Dre<br><br><h1>BARA BARA!</h1><div>",
                                            descripcionCorta:"Exquisitos Beats By Dr. Dre 2.0",
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
                                            subproductos:[{modelo:"spiderman", imagen:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSc1TQkeYONKa-5uJRzLL6TJnLeqYmTpcl_Jxed-S8J6iXTaLiH", precio:4000.0, stock:2},
                                                          {modelo:"esmeralda", imagen:"http://ecx.images-amazon.com/images/I/41oPxGAzuCL._SY300_.jpg", precio:3100.0, stock:15},
                                                          {modelo:"azul", imagen:"http://i.kinja-img.com/gawker-media/image/upload/s--oZoShgI8--/jgjw1twqvyr9ssi0drjd.jpg", precio:3600.0, stock:11},
                                                          {modelo:"kitty", imagen:"http://cnet2.cbsistatic.com/hub/i/r/2014/10/28/18c1e8ac-c6a0-4ff7-af57-e3a298dfa67f/resize/770x578/ba037bd9fc28864186377005ec3adc49/hellokittyheadphones.jpg", precio:3200.0, stock:10}
                                                        ],
                                            ratings:[{stars:5,comentario:"MUY BUEN VENDEDOR",fecha:new Date()},{stars:4,comentario:"Bueno pero tardó el envío",fecha:new Date()}], //[{stars:int,comentario:string}]
                                            categorias:['#audifonos','#beats',"#DrDre","#Audio",'#Electrónica'],
                                            isPrincipal:true,
                                            youtube:'https://www.youtube.com/watch?v=xlljElC0ehg',
                                            tienda:newTienda
                                        },{
                                            nombre:"Consola PS4",
                                            descripcion:"<div>Vendo consola PS4, con un control, sellada<br><br><h1>LLevele Llévele!</h1><div>",
                                            descripcionCorta:"PS4 Nuevo y Sellado",
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
                                        },{
                                            nombre:"Consola PS4",
                                            descripcion:"<div>Vendo consola PS4, con un control, sellada<br><br><h1>LLevele Llévele!</h1><div>",
                                            descripcionCorta:"PS4 Nuevo y Sellado",
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
                                        console.log("PRODUCTOS ERR > > > > > > > > ",err);
                                        console.log("PRODUCTOS > > > > > > > > ",productos);

                                          Venta.create({
                                        folio:222,
                                        tienda:newTienda,
                                        cliente:userNew,
                                        totalEnvio:4,
                                        totalVenta:200,
                                        calificacion:9,
                                        status:1

                                        }).exec(function(err,newVenta){
                                            console.log(newVenta);
                                            console.log(err);
                                            var productosVenta = [{
                                            venta:newVenta,
                                            producto:productos[0],
                                            precioVenta:productos[0].precio,
                                            cantidad:3,
                                            subtotal:productos[0].precio*3,
                                            subtotalEnvio:20
                                        },{
                                             venta:newVenta,
                                            producto:productos[1],
                                            precioVenta:productos[1].precio,
                                            cantidad:2,
                                            subtotal:productos[1].precio*2,
                                            subtotalEnvio:20
                                        },{
                                            venta:newVenta,
                                            producto:productos[2],
                                            precioVenta:productos[2].precio,
                                            cantidad:2,
                                            subtotal:productos[2].precio,
                                            subtotalEnvio:20
                                        },{
                                             venta:newVenta,
                                            producto:productos[3],
                                            precioVenta:productos[3].precio,
                                            cantidad:2,
                                            subtotal:productos[3].precio,
                                            subtotalEnvio:20
                                        }];

                                        ProductosVenta.create(productosVenta).exec(function(err,productosVenta){

                                        });



                                        });
                                    });
                                    createdMerc.tiendas = [newTienda];
                                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AQUI ESTA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                                    //createdMerc.save(console.log);
                                });
	                         });
                        });

                        User.create({username:'danielm@mitianguis.com', email:'lentium.mmx@gmail.com', password:'danielm',perfil:'MERCANTE', verificacion:1})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'José Daniel',apellidoPaterno:'Morales',apellidoMaterno:'Ríos', mentor:created,fechaNacimiento:moment('1981 05 15').toDate(),codigoMercante:'DANIMORALES',diaInscripcion:moment().date(),usuario:userNew})
	                         .exec(function(err,createdMerc){
                               ConektaToken.create({ conektaToken: 'tok_test_visa_4242', creditDebitCardMask: 'XXXX-XXXX-XXXX-4242', financialServiceBrand: 'VISA', mercante: createdMerc }).exec(function(err,cCon) {
                                 console.log(cCon);
                                 Mercante.update({id: cCon.mercante}, {conektaToken: cCon}).exec(function(err, uMer) {
                                   console.log(uMer);
                                 });
                               });
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar) {
	                                 console.log(cCar);

	                             });
	                         });
                        });

                        User.create({username:'oscarg@mitianguis.com', email:'pachecobionica@gmail.com', password:'oscarg',perfil:'MERCANTE', verificacion:1})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Oscar',apellidoPaterno:'García',apellidoMaterno:'Pacheco', mentor:created,fechaNacimiento:moment('1981 08 21').toDate(),codigoMercante:'OSCARGARCIA',diaInscripcion:moment().date(), usuario:userNew})
	                         .exec(function(err,createdMerc){
                               ConektaToken.create({ conektaToken: 'tok_test_insufficient_funds', creditDebitCardMask: 'XXXX-XXXX-XXXX-0127', financialServiceBrand: 'VISA', mercante: createdMerc }).exec(function(err,cCon) {
                                 console.log(cCon);
                                 Mercante.update({id: cCon.mercante}, {conektaToken: cCon}).exec(function(err, uMer) {
                                   console.log(uMer);
                                 });
                               });
	                             Cartera.create({varoActual:0,ultimoMovimiento:new Date(),mercante:createdMerc}).exec(function(err,cCar){
	                                 console.log(cCar);

	                             });
	                         });
                        });

                        User.create({username:'oscarm@mitianguis.com', email:'oscar.monroyg@gmail.com', password:'oscarm', perfil:'MERCANTE', verificacion:1})
                        .exec( function(err, userNew){
	                         Mercante.create({nombre:'Oscar',apellidoPaterno:'Monroy',apellidoMaterno:'García', mentor:created,fechaNacimiento:moment('1985 08 20').toDate(),codigoMercante:'OSCARMONROY',diaInscripcion:moment().date(), usuario:userNew})
	                         .exec(function(err,createdMerc){
                               ConektaToken.create({ conektaToken: 'tok_test_mastercard_4444', creditDebitCardMask: 'XXXX-XXXX-XXXX-4444', financialServiceBrand: 'MASTERCARD', mercante: createdMerc }).exec(function(err,cCon) {
                                 console.log(cCon);
                                 Mercante.update({id: cCon.mercante}, {conektaToken: cCon}).exec(function(err, uMer) {
                                   console.log(uMer);
                                 });
                               });
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

    TipoTransaccion.find().exec(function(err, found) {
      if(!found || found.length === 0) {
        TipoTransaccion.create({ordinal: 1, descripcion: 'Retiro', codigo: 'RET'}).exec(function(err, cTipoTrans) {
          console.log(cTipoTrans);
        });
        TipoTransaccion.create({ordinal: 2, descripcion: 'Pago', codigo: 'PAG'}).exec(function(err, cTipoTrans) {
          console.log(cTipoTrans);
        });
        TipoTransaccion.create({ordinal: 3, descripcion: 'Cargo Mensualidad', codigo: 'CAR_MENS'}).exec(function(err, cTipoTrans) {
          console.log(cTipoTrans);
        });
        TipoTransaccion.create({ordinal: 4, descripcion: 'Deposito Comisión', codigo: 'DEP_COM'}).exec(function(err, cTipoTrans) {
          console.log(cTipoTrans);
        });
      }
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

    User.native(function (err,collection){
        collection.createIndex( { username: 1 }, { unique: true } ,function(error, docs) {

        // Handle Errors

        // Do mongo-y things to your docs here

        });
    })

//GENERANDO PRODUCTOS POR DEFAULT PARA UN MERCANTE




    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
