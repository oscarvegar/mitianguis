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
        console.log("CARRITO SESION >>>>>>",$rootScope.carrito)
				if(!$rootScope.carrito){
          console.log("CARRITO ES NULL")
          $http.get("/carrito/create/"+tienda.id).success(function(carrito){
            carrito.productosCarrito = [];
            $rootScope.carrito = carrito;
            console.log("CARRITO>>>>>>>>>>>>>>>>>>>>>",carrito);
            $scope.persist();
          })
        }
			}).error(function(err){
				console.log(err);
			})
		}else{
			/*** SI EL USUARIO NO HA HECHO LOGIN *****/
			$rootScope.carrito = webUtil.getJSON("carrito");
			if($rootScope.carrito===null){
        $http.get("/carrito/create/"+tienda.id).success(function(carrito){
          carrito.productosCarrito = [];
          $rootScope.carrito = carrito;
          console.log("CARRITO>>>>>>>>>>>>>>>>>>>>>",carrito);
          $scope.persist();
        })
			}
		}
	}

	$scope.addToCart = function(item,_cantidad){
		console.log("ITEM",item)
		console.log("CANTIDAD",_cantidad);
		var idxItem = $scope.findItemInCarrito(item);
		console.log("INDEX:",idxItem)
		if(idxItem<0){
			var newItem = angular.copy(item);
			$rootScope.carrito.productosCarrito.push({producto:newItem,cantidad:_cantidad,modeloSelected:newItem.modeloSelected})
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
        console.log("EL USUARIO SE ACABA DE LOGUEAR CON SU CARRITO ITO ITO >>>>>>>>>>>>>>>>")
        var tienda = webUtil.getJSON('tienda');
        /*****SI EL USUARIO HIZO LOGIN*****/
        $http.get('/carrito/current/' + tienda.id)
          .success(function (data) {
            if (data) {
              $rootScope.carrito = data;
            }
          }).error(function (err) {
            console.log(err);
          })
      }
    });



	$scope.init();

});
