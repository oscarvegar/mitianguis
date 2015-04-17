/**
 * Created by oscarm on 13/04/15.
 */
var module = angular.module("VentasAdminModule",[]);

module.controller("VentasAdminController", function($window,$scope, $http){

//data-ng-init="init()" ng-click="tabChange($event)"
  $scope.init = function(){
      console.log("Inicio");

      console.log("Tienda");

      var usuario = JSON.parse( $window.localStorage.getItem("usuario") );

      $http.get("/misventas/"+usuario.id).then(function(result){
      $scope.misventas = result.data;
     
      console.log("Termino Consulta Ventas");
      console.log(  $scope.misventas);
      console.log($scope.misventas[0].value[0].precioVenta);

      $scope.ventas = new Array();
      for(var i=0;i<$scope.misventas.length;i++){
        for(var j=0;j<$scope.misventas[i].value.length;j++){
          
                 $scope.ventas.push({
                   "nombre": $scope.misventas[i].value[j].producto.nombre,
                   "cantidad":$scope.misventas[i].value[j].cantidad,
                   "subtotal": $scope.misventas[i].value[j].precioVenta,
                   "totalVenta": $scope.misventas[i].value[j].subtotal
                 });
          }
      }

      console.log( $scope.ventas );
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


/*
      $http.get("/misventas").then(function(result){
      $scope.misventas = result.data;
     
     console.log("Termino Consulta Ventas");
      console.log(  $scope.misventas);
    });
*/

  }

});
