/**
 * Created by oscarm on 13/04/15.
 */
var miperfil = angular.module("MiPerfilModule",[]);
miperfil.controller("PerfilAdminController", function($scope, $http, $window){
      $scope.init = function(){
      	    console.log("antes de la peticion");
      	    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
      	    console.log(usuario);
      	    $http.get("/getUserCurrent/"+usuario.username).then(function(result){  
      	    console.log(result);   
      	    		$scope.user = {};
      	    		$scope.user.username = result.data.username;
      				$scope.user.email = result.data.email;
      		});	

      },

      $scope.engineSubmit = function(){
           if(!$scope.checked){
           	 $scope.user.password = '';
           }
           console.log($scope.user);

           $http.post("/registro/test",{usuario:$scope.user})
           .success(function(data, status, headers, config){
           		console.log("se actualizo el usuario sin error");
           		console.log(data);

           })
           .error(function(data, status, headers, config){
  				console.log("error al actualizar el usuario");         	               


           });

      }

      $scope.init();


});
