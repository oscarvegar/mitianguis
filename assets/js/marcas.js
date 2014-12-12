var marcasModule = angular.module("MarcasModule",[]);
marcasModule.controller("MarcasController", ["$scope", "$http", 
function($scope, $http){
    var $brandCarousel = $('.brand-carousel .inner');
    /*Initializing Brands Carousel Plugin
	*******************************************/
	$brandCarousel.owlCarousel({
		// Define custom and unlimited items depending from the width
		// If this option is set, itemsDeskop, itemsDesktopSmall, itemsTablet, itemsMobile etc. are disabled
		// For better preview, order the arrays by screen size, but it's not mandatory
		// Don't forget to include the lowest available screen size, otherwise it will take the default one for
        // screens lower than lowest available.
        
		// In the example there is dimension with 0 with which cover screens between 0 and 450px
		itemsCustom : [
                        [0, 1],
                        [340, 2],
                        [580, 3],
                        [991, 4],
                        [1200, 5]
                    ],
		navigation : true,
		theme: "",
		navigationText : ["",""]
	});
}]);
