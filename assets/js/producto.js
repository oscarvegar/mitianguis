angular.module("ProductoModule",[])
.controller('ProductoCtrl', function($scope,$http,$location,$sce,$timeout,$rootScope){
	$scope.showDesc=true;
	$scope.tiendaURL = webUtil.getJSON("tienda").url;
	console.log("META DESC",$rootScope.meta)
	var params = $location.search();
	if(params.p){
		$scope.cantidad = 1;
		console.log("DATA PARAM",params.p);
		$http.get('/producto/'+params.p).success(function(data){
			$scope.selProducto = data;
			if($scope.selProducto.subproductos && $scope.selProducto.subproductos.length>0){
				for(var i in $scope.selProducto.subproductos){
					if($scope.selProducto.subproductos[i].stock<1){
						$scope.selProducto.subproductos.splice(i,1);
					}
				}
				$scope.selProducto.precio = $scope.selProducto.subproductos[0].precio;
				$scope.selProducto.stock = $scope.selProducto.subproductos[0].stock;
				$scope.selProducto.modeloSelected = $scope.selProducto.subproductos[0];
				$scope.selProducto.subproductos[0].selected = true;
			}
			$scope.descripcionProductoHTML = $sce.trustAsHtml($scope.selProducto.descripcion);
			$scope.selImagen = $scope.selProducto.imagenPrincipal;
			$scope.imagenes = [{src:$scope.selProducto.imagenPrincipal,mainClass:'ms-sl-selected',thumbClass:'ms-thumb-frame-selected'}];
			for(var i in $scope.selProducto.imagenesSecundarias){
				$scope.imagenes.push({src:$scope.selProducto.imagenesSecundarias[i]});
			}
			
			$timeout(function() {
			/*Catalog Single
			*******************************************/
			//Product Gallery
			if($('#prod-gal').length > 0) {
				var categorySlider = new MasterSlider();
				categorySlider.control('thumblist' , {autohide:false ,dir:'h',align:'bottom', width:137, height:130, margin:15, space:0 , hideUnder:400});
				categorySlider.setup('prod-gal' , {
						width:550,
						height:484,
						speed: 25,
						preload:'all',
						loop:true,
						view:'fade',
						//layout: 'fullwidth',
						preload:'all',
            			fillMode:'stretch',
						view:'basic',
						instantStartLayers: true
				});
			}
			
			}, 10); 
			
		});
	}

	$scope.togglePanels = function(panel){
			$scope.showDesc = false;
			$scope.showSpecs = false;
			$scope.showRevs = false;
			if(panel == 1){
				$scope.showDesc = true;
			}else if(panel == 2){
				$scope.showSpecs = true;
			}else if(panel == 3){
				$scope.showRevs = true;
			}
		
	}

	$scope.range = function(min, max, step){
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) input.push(i);
	    return input;


  	};

 	$scope.desSeleccionarModelos = function(modelo){
		for(var i in $scope.selProducto.subproductos){
			$scope.selProducto.subproductos[i].selected = false;
		}
		$scope.selProducto.precio = modelo.precio;
		$scope.selProducto.stock = modelo.stock;
		$scope.selProducto.modeloSelected = modelo;
		console.log($scope.selProducto.modeloSelected.id)
		modelo.selected = true;
	}
	

});