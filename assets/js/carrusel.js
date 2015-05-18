var carruselModule = angular.module("CarruselModule",[]);
carruselModule.controller("CarruselCtrl", function($scope, $http,$timeout,$sce){
	$scope.productosPrincipales = [];
	$scope.tienda = webUtil.getJSON("tienda");
	$scope.renderHtml = function(html_code){
	    return $sce.trustAsHtml(html_code);
	};
	$http.get('/producto/productoPrincipalByTienda/'+$scope.tienda.id)
	.success(function(data){
		console.log(data)
		$scope.productosPrincipales = data;
		if($scope.productosPrincipales.length==0)return;
		$timeout(function() {
			/*Hero Slider
			*******************************************/
			if($('#hero-slider').length > 0) {
				var heroSlider = new MasterSlider();
				heroSlider.control('arrows');
				heroSlider.control('bullets');
				heroSlider.setup('hero-slider' , {
						width:1140,
						height:455,
						space:0,
						speed: 18,
						autoplay: true,
						loop: true,
            //layout: 'fullwidth',
						//preload:'all',
            fillMode:'stretch',
						view:'basic',
						instantStartLayers: true
				});
			}
		}, 1200);



	})

	/*Hero Fullscreen Slider
	*******************************************/
	if( !$('#fullscreen-slider') && $('#fullscreen-slider').length > 0) {
		var fullscreenSlider = new MasterSlider();
		fullscreenSlider.control('arrows');
		fullscreenSlider.control('bullets');
		fullscreenSlider.setup('fullscreen-slider' , {
				width:1140,
				height:455,
				space:0,
				speed: 18,
				autoplay: true,
				loop: true,
				layout: 'fullscreen',
				fullscreenMargin: 0,
				preload:'all',
				view:'mask',
				instantStartLayers: true
		});
	}

})
.directive("carrusel", function( ){
        return {
            restrict:"E",
            templateUrl:"../pages/store/carrusel.html"
        };
    });
