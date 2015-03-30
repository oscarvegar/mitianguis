angular.module("ProductoModule",[])
.controller('ProductoCtrl', function($scope,$http,$location){
	var params = $location.search();
	if(params.p){
		console.log("DATA PARAM",params.p);
		$http.get('/producto/'+params.p).success(function(data){
			console.log("DATA RES",data);
			$scope.selProducto = data;
		});
	}

});