var toolbarModule = angular.module("ToolbarModule",[]);
toolbarModule.controller("ToolbarController", ["$scope", "$http", "$rootScope",
function($scope, $http, $rootScope){
    var $searchBtn = $('.search-btn');
	var $searchForm = $('.search-form');
	var $closeSearch = $('.close-search');
    
    $scope.toRegister = function() {
        $rootScope.viewToolbar = false;
        window.location.href = "#/registroweb";  
    }
    
    $scope.titleReg = "Registro";
    
    $scope.sayHello = function() {
        $scope.person.name = "Ari Lerner";
        $scope.person.greeted = true;
    }
    
    /*Search Form Toggle
	*******************************************/
	$searchBtn.click(function(){
		$searchForm.removeClass('closed').addClass('open');
	});

	$closeSearch.click(function(){
		$searchForm.removeClass('open').addClass('closed');
	});
	$('.page-content, .subscr-widget, footer').click(function(){
		$searchForm.removeClass('open').addClass('closed');
	});

}]);
