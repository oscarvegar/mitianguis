/**
 * Created by oscarm on 27/04/15.
 */
var comprasClienteModule = angular.module("ComprasClienteAdminModule",[]);
comprasClienteModule.controller("ComprasClienteController", function($rootScope, $scope, $http, $window){

  console.log("mis compras");

  $scope.init = function(){

      $scope.statusVenta = ["Confirmado"];

      var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
      var status = 0;
 
      console.log(usuario.id);

      $http.get("/comprasCliente/"+usuario.id+"/"+status).then(function(result){
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



  $scope.tabSelected = "#tab01";

  $scope.tabChange = function(e){
      if (e.target.nodeName === 'A') {
          $scope.tabSelected = e.target.getAttribute("href");
          e.preventDefault();
      }
  }

  $scope.setStatus = function(ventaStatus,valor,id){
    console.log("Set Status");
    console.log(ventaStatus);
    console.log(valor);
    console.log(id);
      $scope.ventaStatusParametro = ventaStatus;
      $scope.ventaStatusOriginal = valor;
      $scope.id = id;
  };


  $scope.consultarCompras = function(status){

    console.log("consultar compras tabulador");
    console.log(status);

    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );

    $http.get("/comprasCliente/"+usuario.id+"/"+status).then(function(result){
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


  $scope.cambiarStatus = function(ventaStatusParametro,statusOriginal,id){
    console.log("Cambiar Parametros");
    console.log(ventaStatusParametro);
    console.log(statusOriginal);
    console.log(id);


    if(ventaStatusParametro == "Confirmado"){
      var status = 3;
    }


    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );

    $http.post("/misventasStatus/"+id+"/"+status).then(function(resultStatus){
     
          console.log("Exitoso>>>");
          console.log(resultStatus);

          $http.get("/comprasCliente/"+usuario.id+"/"+statusOriginal).then(function(result){
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



});
