angular.module("TiendaModule",[])
.controller('TiendaCtrl', function($scope,$http){
	$scope.productos = [];
	$scope.categorias = [];
	$scope.tienda = webUtil.getJSON("tienda");
	$http.get('/producto/productoByTienda/'+$scope.tienda.id)
	.success(function(data){
		console.log(data)
		$scope.productos = data; 
	})
	$http.get('/categoria/categoriasByTienda/'+$scope.tienda.id)
	.success(function(data){
		console.log(data)
		$scope.categorias = data; 
	})
})
