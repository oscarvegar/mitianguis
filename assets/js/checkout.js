angular.module("CheckoutModule",[])
.controller('CheckoutCtrl', function($scope,$http,$location,$sce,$timeout,$rootScope,$CarritoService){
	$scope.init = function(){
		$scope.orden = {};
		console.info($rootScope.usuario)
		if($rootScope.usuario){
			$scope.orden.email = $rootScope.usuario.username;
		}
		$scope.datosPago = {};
		$scope.orden.codigoPostal = null;
		$scope.direcciones = [];
		$scope.datosPago = {};
		

		/******************DATOS DE PRUEBA****************************
		$scope.orden.nombre = "oscar";
		$scope.orden.apellidoMaterno = "rodriguez";
		$scope.orden.apellidoPaterno = "vega";
		$scope.orden.calle = "calle 2 No. 36";
		$scope.orden.codigoPostal = "07680";
		$scope.orden.email = "oscarm@mitianguis.com";
		$scope.orden.telefono = "5520686109";
		$scope.buscarDireccion();
		$scope.datosPago.name = "OSCAR VEGA RODRIGUEZ"                                                                                                                                                                                                                                                                                                                            $scope.datosPago.number = "4242424242424242"
		$scope.datosPago.cvc = "777"
		/***********************************************/


	}
	
	


	$scope.buscarDireccion = function(){
		$http.get('/direccion/find/'+$scope.orden.codigoPostal).success(function(data){
			console.log(data)
			$scope.direcciones = data;
			$scope.orden.selColonia = data[0];
		})
	}

	$scope.ordenar = function(){
		$scope.disBtnPagar = true;
		$scope.datosPago.exp_year = $rootScope.selAno;
		$scope.datosPago.exp_month = $rootScope.selMes;
		var card = {card:$scope.datosPago};
		console.log(JSON.stringify(card));
		Conekta.token.create(card,
		function(data){
			var token = data.id;
			$scope.orden.conektaToken = data.id;
			$scope.orden.carrito = $rootScope.carrito;
			$http.post('/venta/checkout',$scope.orden)
			.success(function(data){
				console.log(data)
				$scope.disBtnPagar = false;
				$CarritoService.destroy();
				$location.url("/gracias")
			})
			.error(function(err){
				$scope.disBtnPagar = false;
				console.info("ERROR",err) 
				$rootScope.error = err.msg;
				$('#errorModal').modal('show');
			})
		},
		function(err){
				$scope.disBtnPagar = false;
				console.info("ERROR",err) 
				$rootScope.error = err.message_to_purchaser;
				$scope.$apply();

				$('#errorModal').modal('show');


		});
	}
	$rootScope.$watch('usuario',function(){
		if($rootScope.usuario){
			$scope.orden.nombre = $rootScope.usuario.nombre;
			$scope.orden.apellidoPaterno = $rootScope.usuario.apellidoPaterno;
			$scope.orden.apellidoMaterno = $rootScope.usuario.apellidoMaterno;
			$scope.orden.email = $rootScope.usuario.username;
			$scope.orden.telefono = $rootScope.usuario.telefono;
		}
	})
	$rootScope.$watch('carrito',function(){
		if($rootScope.carrito && $rootScope.carrito.total>3)
			$scope.disBtnPagar = false;
		else
			$scope.disBtnPagar = true;
	})

	$scope.buscarUsuario = function(){
		$http.post('/venta/buscarDatosByEmail/'+$scope.orden.email)
		.success(function(data){
			$scope.orden.telefono = data.telefono;
			if(data.direccion){
				$scope.orden.codigoPostal = data.direccion.codigoPostal;
			}
		}).error(function(err){
			console.log(err);
		});
	}


$scope.init();
	
});
