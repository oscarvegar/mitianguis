var carruselModule = angular.module("CarruselModule",[]);
carruselModule.controller("CarruselController", ["$scope", "$http", 
function($scope, $http){
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
				layout: 'fullwidth',
				preload:'all',
				view:'basic',
				instantStartLayers: true
		});
	}
	
	/*Hero Fullscreen Slider
	*******************************************/
	if($('#fullscreen-slider').length > 0) {
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
				fullscreenMargin: 116,
				preload:'all',
				view:'mask',
				instantStartLayers: true
		});
	}
}]);
