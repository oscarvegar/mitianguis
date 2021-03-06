angular.module("TiendaModule",[])
.controller('TiendaCtrl', function($scope,$http,$location,$timeout){
	$scope.init = function(){
		console.log("TIENDA MODULE")
		$scope.categorias = [];
		$scope.tienda = webUtil.getJSON("tienda");
		$http.get('/producto/productoByTienda/' + $scope.tienda.id)
		.success(function(data){
			$scope.productos = data;
			if($scope.productos.length ==0){
				$scope.productos = -1;
			}
		})
		$http.get('/categoria/categoriasByTienda/'+$scope.tienda.id)
		.success(function(data){
			console.log(data)
			$scope.categorias = data;
		})
	}
	$scope.seleccionarProducto = function(prod){
		window.location.href = '/?'+prod.id+"#/producto?p="+prod.id;
	}

    $scope.buscaCategoria = function(cat){
    	if(cat==-1){
    		$http.get('/producto/productoByTienda/' + $scope.tienda.id)
			.success(function(data){
				$scope.productos = data;
				if($scope.productos.length ==0){
					$scope.productos = -1;
				}
			})
    	}else{
    		$http.post('/producto/productoByTiendaCategorias',{id:$scope.tienda.id,categoria:{contains:cat}}).success(function(data){
	        	$scope.productos = data;
	      	})
    	}
      
    }

    $timeout($scope.init,1000)

})
