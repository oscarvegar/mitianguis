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

	}
 
	$scope.addToCart = function(item,cantidad){
		
		console.log("ITEM",item)
		console.log("CANTIDAD",cantidad)
		
	}

});