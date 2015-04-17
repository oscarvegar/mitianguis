angular.module("CheckoutModule",[])
.controller('CheckoutCtrl', function($scope,$http,$location,$sce,$timeout,$rootScope){
	$scope.orden = {};
	$scope.datosPago = {};
	$scope.orden.codigoPostal = null;
	$scope.direcciones = [];
	$scope.meses = ["01","02","03","04","05","06","07","08","09","10","11","12"]
	$scope.selMes = "01";
	$scope.anos = ["15","16","17"]
	$scope.selAno = "17";
	$scope.datosPago = {};
	$scope.disBtnPagar = false;


	$scope.buscarDireccion = function(){
		$http.get('/direccion/find/'+$scope.orden.codigoPostal).success(function(data){
			console.log(data)
			$scope.direcciones = data;
			$scope.orden.selColonia = data[0];
		})
	}

	$scope.ordenar = function(){

		console.log($scope.selAno)
		console.log($scope.selMes)
		$scope.datosPago.exp_year = $scope.selAno;
		$scope.datosPago.exp_month = $scope.selMes;
		console.log($scope.orden);
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
			})
			.error(function(err){
				console.log(err)
				$scope.disBtnPagar = false;
			})
		},
		function(err){
			console.log("ERROR",err)
		});
	}
	$rootScope.$watch('usuario',function(){
		$scope.orden.nombre = $rootScope.usuario.mercante.nombre;
		$scope.orden.apellidoPaterno = $rootScope.usuario.mercante.apellidoPaterno;
		$scope.orden.apellidoMaterno = $rootScope.usuario.mercante.apellidoMaterno;
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

	/******************DATOS DE PRUEBA****************************/
		$scope.orden.nombre = "oscar";
		$scope.orden.apellidoMaterno = "rodriguez";
		$scope.orden.apellidoPaterno = "vega";
		$scope.orden.calle = "calle 2 No. 36";
		$scope.orden.codigoPostal = "07680";
		$scope.orden.email = "oscarm@mitianguis.com";
		$scope.orden.telefono = "5520686109";
		$scope.buscarDireccion();

		$scope.datosPago.name = "OSCAR VEGA RODRIGUEZ"
		$scope.datosPago.number = "4242424242424242"
		$scope.datosPago.cvc = "777"


	/***********************************************/
});
