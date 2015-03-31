// EmailService.js - in api/services
module.exports = {
  aplicarCargo: function(mercante,cantidad,cb) {
    //logica para aplicar el cargo y transferir las comisiones
    Cartera.findOne().where({mercante:mercante.id}).exec(function(err,cartera){
        console.log(err);
        cartera.varoActual+=cantidad;
        cartera.save(function(){
            console.log(">>>>> SE HA APLICADO LA TRANSACCIÓN POR "+cantidad+ " VAROS");
            //regresa de la transacción y se reparten las comisiones.
            cb({codigo:0,mensaje:"Se ha aplicado la transacción"});
        });

    });
  }
};
