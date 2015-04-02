angular.module("CarritoModule",[])
.controller('CarritoCtrl', function($scope,$http,$location,$sce,$timeout,$rootScope){
	$scope.showATC = false;
	$scope.init = function(){
		/*****SI EL USUARIO HIZO LOGIN*****
		$http.get('/carrito/current')
		.success(function(data){

		}).error(function(err){

		})/
		/*** SI EL USUARIO NO HA HECHO LOGIN *****/
		$rootScope.carrito = webUtil.getJSON("carrito");
		if($rootScope.carrito===null){
			$rootScope.carrito = {};
			$rootScope.carrito.productosCarrito = [];
		}
		

	}

	$scope.addToCart = function(item,_cantidad){
		console.log("ITEM",item)
		console.log("CANTIDAD",_cantidad);
		var idxItem = $scope.findItemInCarrito(item);
		console.log("INDEX:",idxItem)
		if(idxItem<0){
			$rootScope.carrito.productosCarrito.push({producto:item,cantidad:_cantidad})
		}else{
			$rootScope.carrito.productosCarrito[idxItem].cantidad += _cantidad;
		}
		$scope.showATC = true;
		$scope.persist();
		console.log($rootScope.carrito);
		$timeout(function() {$scope.showATC = false}, 3000); 

	}

	$scope.findItemInCarrito = function(itemSearch){
		for(var i in $rootScope.carrito.productosCarrito){
			var item = $rootScope.carrito.productosCarrito[i];
			console.log("CURR ITEM",item)
			console.log("itemSearch",itemSearch)
			if(item.producto.id === itemSearch.id){
				return i;
			}
		}
		return -1;
	}

	$scope.incrementa = function(item){
		item.cantidad++;
		$scope.persist()
	}

	$scope.decrementa = function(item){
		item.cantidad = item.cantidad==1?1:item.cantidad-1;
		$scope.persist();
	}

	$scope.eliminar = function(idx){
		$rootScope.carrito.productosCarrito.splice(idx,1)
		$scope.persist();
	}

	$scope.persist = function(){
		$rootScope.carrito.totalItems = 0;
		$rootScope.carrito.total = 0;
		for(var i in $rootScope.carrito.productosCarrito){
			var item = $rootScope.carrito.productosCarrito[i];
			$rootScope.carrito.totalItems += item.cantidad;
			$rootScope.carrito.total += (item.cantidad * item.producto.precio) ;
		}
		webUtil.save('carrito',$rootScope.carrito);
	};
	$scope.init();

});