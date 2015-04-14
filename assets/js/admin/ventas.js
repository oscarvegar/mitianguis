/**
 * Created by oscarm on 13/04/15.
 */
var module = angular.module("VentasAdminModule",[]);

module.controller("VentasAdminController", function($scope, $http){

  $scope.init = function(){
      console.log("Inicio");

      $http.get("/misventas").then(function(result){
      $scope.misventas = result.data;
     
     console.log("Termino Consulta Ventas");
      console.log(  $scope.misventas);
    });
  }

  $scope.init();

  $scope.tabSelected = "#tab1";

  $scope.tabChange = function(e){
      if (e.target.nodeName === 'A') {
          $scope.tabSelected = e.target.getAttribute("href");
          e.preventDefault();
      }
  }



  $scope.consultarVentas = function(){



      $http.get("/misventas").then(function(result){
      $scope.misventas = result.data;
     
     console.log("Termino Consulta Ventas");
      console.log(  $scope.misventas);
    });


  }

});
