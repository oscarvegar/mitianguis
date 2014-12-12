var toolbarModule = angular.module("ToolbarModule",[]);
toolbarModule.controller("ToolbarController", ["$scope", "$http", 
function($scope, $http){
    var $searchBtn = $('.search-btn');
	var $searchForm = $('.search-form');
	var $closeSearch = $('.close-search');
    
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
