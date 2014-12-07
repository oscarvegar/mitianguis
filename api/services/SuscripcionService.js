// EmailService.js - in api/services
module.exports = {

    suscribir: function(mercante,cb) {
        //logica para aplicar el cargo y transferir las comisiones
        Parametro.findOne({llave:'MENSUALIDAD'}).exec(function(err,cParam){
            ConektaService.aplicarCargo(mercante,cParam.valor,function(res){
                //regresa de la transacción 
                cb(res);
                //calculo de comisiones.
                Parametro.findOne({datosSystem:{$exists:true}}).exec(function(err,datosSystem){
                    module.exports.calcularComisiones(mercante,mercante.mentor,1,0,cParam.valor,datosSystem);
                });
            });
        });


    },
    renovarSuscripcion:function(mercante,cantidad,cb){
        console.log("mercante>>>>>>>>>");
        console.log(mercante);
        Cartera.findOne().where({mercante:mercante.id}).exec(function(err,cartera){
            cartera.varoActual+=cantidad;
            cartera.save(function(){
                console.log(">>>>> SE HA APLICADO LA TRANSACCIÓN POR "+cantidad+ " VAROS");
                //regresa de la transacción y se reparten las comisiones.
                cb({codigo:0,mensaje:"Se ha aplicado la transacción"});
                //logica para aplicar el cargo y transferir las comisiones
                Parametro.findOne({llave:'MENSUALIDAD'}).exec(function(err,cParam){
                    //regresa de la transacción 

                    //calculo de comisiones.
                    Parametro.findOne({datosSystem:{$exists:true}}).exec(function(err,datosSystem){
                        module.exports.calcularComisionesRenovacion(mercante,mercante.mentor,1,0,cantidad,datosSystem);
                    });

                });
            });

        });

    },
    calcularComisiones:function(mercante,mentor,nivel,repartido,varoInicial,datosSystem){
        Cartera.findOne().where({mercante:mercante.id}).exec(function(err,fCarteraInscrito){
            Cartera.findOne().where({mercante:mentor}).exec(function(err,fMer){
                console.log(fMer);
                var cantidad = 0;
                var esSystem = false;
                if(mentor==datosSystem.datosSystem.systemId){
                    cantidad = varoInicial - repartido;
                    esSystem = true;
                }else if(nivel == 1){
                    cantidad = 99;
                }else if(nivel == 2){
                    cantidad = 33;
                }else{
                    cantidad = 22;
                }
                module.exports.aplicarComision(fCarteraInscrito,fMer,cantidad,function(){
                    if(esSystem == false && nivel <= 5){
                        Mercante.findOne({id:mentor}).exec(function(err,fmerMentor){
                            console.log("datosSystem antes de ir>>>>>>>>>>");
                            console.log(datosSystem);
                            module.exports.calcularComisiones(mercante, fmerMentor.mentor, 1+nivel, cantidad+repartido, varoInicial, datosSystem);
                        });
                    }
                });
            });
        });
    },
    calcularComisionesRenovacion:function(mercante,mentor,nivel,repartido,varoInicial,datosSystem){
        Cartera.findOne().where({mercante:mercante.id}).exec(function(err,fCarteraInscrito){
            Cartera.findOne().where({mercante:mentor}).exec(function(err,fMer){
                console.log(fMer);
                var cantidad = 0;
                var esSystem = false;
                if(mentor==datosSystem.datosSystem.systemId){
                    cantidad = varoInicial - repartido;
                    esSystem = true;
                }else if(nivel == 1){
                    cantidad = 33;
                }else if(nivel == 2){
                    cantidad = 33;
                }else if(nivel <=5){
                    cantidad = 22;
                }else{
                    cantidad = 11;
                }
                module.exports.aplicarComision(fCarteraInscrito,fMer,cantidad,function(){
                    if(esSystem == false && nivel <= 10){
                    Mercante.findOne({id:mentor}).exec(function(err,fmerMentor){
                        console.log("datosSystem antes de ir>>>>>>>>>>");
                        console.log(datosSystem);
                        module.exports.calcularComisionesRenovacion(mercante, fmerMentor.mentor, 1+nivel, cantidad+repartido, varoInicial, datosSystem);
                    });
                }
                });
                
            });
        });
    },
    aplicarComision:function(carteraOrigen,carteraDestino,cantidad,cb){
        carteraOrigen.varoActual-=cantidad;
        carteraDestino.varoActual+=cantidad;
        carteraOrigen.save(function(){
            carteraDestino.save(function(){
                cb();
            });
        });
        
    }
};