angular.module("CarritoModule",[])
.controller('CarritoCtrl', function($scope,$http,$location,$sce,$timeout,$rootScope){
	$scope.showATC = false;
	$scope.init = function(){
    	var tienda = webUtil.getJSON('tienda');
		if($rootScope.usuario){
			/*****SI EL USUARIO HIZO LOGIN*****/
			$http.get('/carrito/current/'+tienda.id)
			.success(function(data){
				$rootScope.carrito = data;
				if(!$rootScope.carrito){
		          $http.get("/carrito/create/"+tienda.id).success(function(carrito){
		            carrito.productosCarrito = [];
		            $rootScope.carrito = carrito;
		            $scope.persist();
		          })
		        }
			}).error(function(err){
				console.log(err);
			})
		}else{
			/*** SI EL USUARIO NO HA HECHO LOGIN *****/
			$rootScope.carrito = webUtil.getJSON("carrito");
			console.log("CARRITO SIN LOGIN",$rootScope.carrito)
			if(!$rootScope.carrito){
		        $http.get("/carrito/create/"+tienda.id).success(function(carrito){
		          carrito.productosCarrito = [];
		          $rootScope.carrito = carrito;
		          $scope.persist();
		        })
			}else{
				$scope.persist();
			}
		}
	}

	$scope.addToCart = function(item,_cantidad){
		var idxItem = $scope.findItemInCarrito(item);
		if(idxItem<0){
			var newItem = angular.copy(item);
			$rootScope.carrito.productosCarrito.push({producto:newItem,cantidad:_cantidad,modeloSelected:newItem.modeloSelected})
		}else{
			$rootScope.carrito.productosCarrito[idxItem].cantidad += _cantidad;
		}
		$scope.showATC = true;
		$scope.persist();
		$timeout(function() {$scope.showATC = false}, 3000);

	}

	$scope.findItemInCarrito = function(itemSearch){
		for(var i in $rootScope.carrito.productosCarrito){
			var item = $rootScope.carrito.productosCarrito[i];
			if(item.producto.id === itemSearch.id){
				if(item.producto.subproductos && item.producto.subproductos.length>0){
					if(item.modeloSelected.id === itemSearch.modeloSelected.id){
						return i;
					}

				}else{
					return i;
				}
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
			$rootScope.carrito.totalItems += parseInt(item.cantidad);
			$rootScope.carrito.total += (item.cantidad * item.producto.precio) ;
		}
		webUtil.save('carrito',$rootScope.carrito);
	    $http.post("/carrito/update",$rootScope.carrito).success(function(carrito){
	      console.log("*** CARRITO SINCRONIZADO CON SERVER ***",carrito)
	    })
	};

    $scope.agregarPregunta = function(){

      if(!$rootScope.carrito.preguntas)$rootScope.carrito.preguntas = [];
      $http.post("/carrito/agregarPregunta",{id:$rootScope.carrito.id,contenido:$scope.pregunta}).success(function(carrito){
        $rootScope.carrito.preguntas = carrito.preguntas;
        $scope.pregunta = '';
        $scope.persist();
      })

    }

    $rootScope.$watch('usuario',function() {
      if($rootScope.usuario) {
        console.log("* * * SET VARIABLE USUARIO * * *");
    	if($rootScope.carrito)
			webUtil.save('carritoViejo',$rootScope.carrito);

        var tienda = webUtil.getJSON('tienda');
        /*****SI EL USUARIO HIZO LOGIN*****/
        $http.get('/carrito/current/' + tienda.id)
          .success(function (data) {
            if (data) {
              	$rootScope.carrito = data;
              	webUtil.save('carrito',$rootScope.carrito);
            }
          }).error(function (err) {
            console.log(err);
          })
      }else{
        console.log("* * * UNSET VARIABLE USUARIO * * *");
        var cviejo = webUtil.getJSON("carritoViejo");
        if(cviejo){
	      	$rootScope.carrito = cviejo;
	      	webUtil.save('carrito',$rootScope.carrito);
	      	webUtil.save('carritoViejo',$rootScope.carrito);
      	}
      	
      }
    });

    $timeout($scope.init,1000);

	//$scope.init();

}).service('$CarritoService',function($rootScope,$http){
	var _this = this;
	this.destroy = function(){
		$http.post('/carrito/destroy/'+$rootScope.carrito.id).success(function(data){
			console.log("CARRITO DESTROY RESP ",data)
			$rootScope.carrito = null;
			delete $rootScope.carrito;
			webUtil.destroy('carrito');
			_this.create();
		});
	}
	this.create = function(){
		$http.get("/carrito/create/"+$rootScope.tienda.id).success(function(carrito){
	        carrito.productosCarrito = [];
	        $rootScope.carrito = carrito;
	        _this.persist();
      	})
	}
	this.persist = function(){
		$rootScope.carrito.totalItems = 0;
		$rootScope.carrito.total = 0;
		for(var i in $rootScope.carrito.productosCarrito){
			var item = $rootScope.carrito.productosCarrito[i];
			$rootScope.carrito.totalItems += parseInt(item.cantidad);
			$rootScope.carrito.total += (item.cantidad * item.producto.precio) ;
		}
		webUtil.save('carrito',$rootScope.carrito);
	    $http.post("/carrito/update",$rootScope.carrito).success(function(carrito){
	      console.log("*** CARRITO SINCRONIZADO CON SERVER ***",carrito)
	    })
	};
});
