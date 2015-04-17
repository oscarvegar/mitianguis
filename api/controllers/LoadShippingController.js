/**
 * LoadShippingController
 *
 * @description :: Server-side logic for managing Loadshippings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var estafeta = require("node-estafeta");
module.exports = {
	
  /**
   * `LoadShippingController.getCotizador()`
   */
  getCotizacionPedido: function (req, res) {
       /* val paramsRequest = req.allParams();
        var pesoEnvio = 0, anchoEnvio = 0 , altoEnvio = 0, largoEnvio = 0;
        for( paramsRequest.productos in producto){
        	pesoEnvio = pesoEnvio + producto.peso;
        	anchoEnvio = anchoEnvio + producto.ancho;
        	altoEnvio = altoEnvio + producto.alto;
        	largoEnvio = largoEnvio + largo.peso; 
        }  */
        
        var resultCotizacion = function(err, result) {
 				if(err) {
 					console.log('****************************** errorResultCotizacion ******************************');
 					console.log(err);
 				return;
 				}

 				console.log('****************************** successResultCotizacion ******************************');
 				console.log(result);
 				return res.json(result );
			};


        var form = {
			 	CPOrigen: 72540,
 				CPDestino: 15000,
 				Tipo: 'paquete',
 				cTipoEnvio: 'paquete',
 				Peso: 5,
 				Alto: 10,
 				Largo: 10,
 				Ancho: 10,
				result: resultCotizacion
		};
   		estafeta.Cotizar.exec(form);
  

  }
};

