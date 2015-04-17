angular.module("TiendaModule",[])
.controller('TiendaCtrl', function($scope,$http,$location){

	$scope.productos = [];
	$scope.categorias = [];
	console.log("SELPRODUCTO INI >>>>> ",$scope.selProducto);
	$scope.tienda = webUtil.getJSON("tienda");
	$http.get('/producto/productoByTienda/' + $scope.tienda.id)
	.success(function(data){
		console.log(data)
		$scope.productos = data;
	})
	$http.get('/categoria/categoriasByTienda/'+$scope.tienda.id)
	.success(function(data){
		console.log(data)
		$scope.categorias = data;
	})

	$scope.seleccionarProducto = function(prod){
		console.log(prod);

		console.log("SELPRODUCTO SET >>>>> ",$scope.selProducto);
		console.log($location.url())
		$location.url("/producto?p="+prod.id)
	}

    $scope.buscaCategoria = function(cat){
      $http.post('/producto/productoByTiendaCategorias',{id:$scope.tienda.id,categoria:{contains:cat}}).success(function(data){
        $scope.productos = data;
      })
    }
})
