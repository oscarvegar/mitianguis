/**
 * Created by oscarm on 13/04/15.
 */
var module = angular.module("VentasAdminModule",[]);

module.controller("VentasAdminController", function($window,$scope, $http){


  $scope.init = function(){

      $scope.statusVenta = ["En Transito","Cancelado"];

      var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
      var status = 0;

      $http.get("/misventas/"+usuario.id+"/"+status).then(function(result){
      $scope.misventas = result.data;

      console.log( $scope.misventas);
      $scope.ventas = new Array();
      for(var i=0;i<$scope.misventas.length;i++){
        for(var j=0;j<$scope.misventas[i].value.length;j++){
          
                 $scope.ventas.push({
                   "folio": $scope.misventas[i].value[j].venta.folio,
                   "nombre": $scope.misventas[i].value[j].producto.nombre,
                   "cantidad":$scope.misventas[i].value[j].cantidad,
                   "subtotal": $scope.misventas[i].value[j].precioVenta,
                   "totalVenta": $scope.misventas[i].value[j].subtotal,
                   "id": $scope.misventas[i].value[j].venta.id
                 });
          }
      }

    });
  }

  $scope.init();

  $scope.setStatus = function(ventaStatus,valor,id){
    console.log("Set Status");
    console.log(ventaStatus);
    console.log(valor);
    console.log(id);
      $scope.ventaStatusParametro = ventaStatus;
      $scope.ventaStatusOriginal = valor;
      $scope.id = id;
  };

  $scope.cambiarStatus = function(ventaStatusParametro,statusOriginal,id){
    console.log("Cambiar Parametros");
    console.log(ventaStatusParametro);
    console.log(statusOriginal);
    console.log(id);


    if(ventaStatusParametro == "En Transito"){

      var status = 1;
    }else{
      var status = -1;
    }


    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );

    $http.post("/misventasStatus/"+id+"/"+status).then(function(resultStatus){
     
          console.log("Exitoso>>>");
          console.log(resultStatus);

          $http.get("/misventas/"+usuario.id+"/"+statusOriginal).then(function(result){
            console.log(result);
          $scope.misventas = result.data;
          $scope.ventas = new Array();
          for(var i=0;i<$scope.misventas.length;i++){
            for(var j=0;j<$scope.misventas[i].value.length;j++){
              
                     $scope.ventas.push({
                       "folio": $scope.misventas[i].value[j].venta.folio,
                       "nombre": $scope.misventas[i].value[j].producto.nombre,
                       "cantidad":$scope.misventas[i].value[j].cantidad,
                       "subtotal": $scope.misventas[i].value[j].precioVenta,
                       "totalVenta": $scope.misventas[i].value[j].subtotal,
                       "id": $scope.misventas[i].value[j].venta.id
                     });
              }
          }

        });

    });


  };


  $scope.tabSelected = "#tab01";

  $scope.tabChange = function(e){
      if (e.target.nodeName === 'A') {
          $scope.tabSelected = e.target.getAttribute("href");
          e.preventDefault();
      }
  }



  $scope.consultarVentas = function(status){

    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );

    $http.get("/misventas/"+usuario.id+"/"+status).then(function(result){
      $scope.misventas = result.data;
      $scope.ventas = new Array();
      for(var i=0;i<$scope.misventas.length;i++){
        for(var j=0;j<$scope.misventas[i].value.length;j++){
          
                 $scope.ventas.push({
                   "folio": $scope.misventas[i].value[j].venta.folio,
                   "nombre": $scope.misventas[i].value[j].producto.nombre,
                   "cantidad":$scope.misventas[i].value[j].cantidad,
                   "subtotal": $scope.misventas[i].value[j].precioVenta,
                   "totalVenta": $scope.misventas[i].value[j].subtotal,
                   "id": $scope.misventas[i].value[j].venta.id
                 });
          }
      }

    });


  }

});
