var schedule = require('node-schedule'),
    mongodb = require('mongodb'),
    moment = require('moment');

var dbg = null,
    Mercante = null,
    Cartera = null,
    Parametro = null;
//SE DECLARA LA CONEXIÓN SI ES DESARROLLO O PRODUCCIÓN
var dbstr = "mongodb://localhost:27017/dev_mitianguis";
if(process.argv.slice(2).indexOf('--prod')>=0){
    console.log("AMBIENTE PRODUCTIVO");
    dbstr = "mongodb://10.100.1.31:27017/mitianguis";
}


//var job = new schedule.Job(function() {
mongodb.connect(dbstr, function (err, db) {
    if(!err) {
        console.log("We are connected");
        Mercante = db.collection('mercante');
        Cartera = db.collection('cartera');
        Parametro = db.collection('parametro');
        var today = moment().date();
        var eom = moment().endOf('month').date();
        console.log(today);
        console.log(eom);
        var query;
        if(today == eom){
            query = {diaInscripcion:{$gte:today}};
        }else{
            query = {diaInscripcion:today};
        }
        Mercante.find(query).toArray(function(err,mercantes){
            Parametro.findOne({llave:'MENSUALIDAD'},function(err,mensualidad){
                Parametro.findOne({datosSystem:{$exists:true}},function(err,datosSystem){
                    //libreria para aplicar cargos
                    renovarSuscripcion(mercantes,198,0,mensualidad.valor,datosSystem);
                });
                //db.close();
            });
        })

    }
});
//});



var rule = new schedule.RecurrenceRule();
//rule.hour = 12; // fire at twelve o'clock
//rule.minute = 0; // fire at minute 0
rule.second = null; // fire at second 0
//job.schedule(rule);


var renovarSuscripcion = function(mercantes,cantidad,actual,mensualidad,datosSystem){
    if(actual == mercantes.length)
        return;
    mercante = mercantes[actual];
    Cartera.findOne({mercante:mercante._id},function(err,cartera){
        cartera.varoActual+=cantidad;
        if(cartera.varoActual < mensualidad){
            var montoACargar = mensualidad - cartera.varoActual;
            //SE HACE EL CARGO HACIA CONEKTA Y SE HACE EL UPDATE EN LA BD.
            cartera.varoAcutal+=montoACargar;
            Cartera.update({_id:cartera._id},{$set:{varoActual:cartera.varoActual}},function(){
                console.log(">>>>> SE HA APLICADO LA TRANSACCIÓN POR "+montoACargar+ " PESOS");
                calcularComisionesRenovacion(mercante,mercante.mentor,1,0,cantidad,datosSystem,function(){
                    renovarSuscripcion(mercantes,cantidad,1+actual,mensualidad,datosSystem);   
                });

            });
        }else{
            console.log(">>>>> SE DESCUENTA DE LOS MISMOS VAROS "+mensualidad+ " PESOS");
             calcularComisionesRenovacion(mercante,mercante.mentor,1,0,cantidad,datosSystem,function(){
                    renovarSuscripcion(mercantes,cantidad,1+actual,mensualidad,datosSystem);   
                });
        }

    });

}


var calcularComisionesRenovacion=function(mercante,mentor,nivel,repartido,varoInicial,datosSystem,cb){

    Cartera.findOne({mercante:mercante._id},function(err,fCarteraInscrito){
        Cartera.findOne({mercante:mentor},function(err,fMer){
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
            aplicarComision(fCarteraInscrito,fMer,cantidad,function(){
                if(esSystem == false && nivel <= 10){
                    Mercante.findOne({_id:mentor},function(err,fmerMentor){
                        calcularComisionesRenovacion(mercante, fmerMentor.mentor, 1+nivel, cantidad+repartido, varoInicial, datosSystem,cb);
                    });
                }else{
                    cb();
                }
            });

        });
    });
}
var aplicarComision = function(carteraOrigen,carteraDestino,cantidad,cb){
    console.log(">>>>>TRANSFIRIENDO DE "+JSON.stringify(carteraOrigen)+" A "+JSON.stringify(carteraDestino)+cantidad+" DE VARO");
    carteraOrigen.varoActual-=cantidad;
    carteraDestino.varoActual+=cantidad;
    Cartera.update({_id:carteraOrigen._id},{$set:{varoActual:carteraOrigen.varoActual}},function(){
        Cartera.update({_id:carteraDestino._id},{$set:{varoActual:carteraDestino.varoActual}},function(){
            cb();
        });

    });

}
