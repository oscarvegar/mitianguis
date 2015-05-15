var adminModule = angular.module("AdminClienteModule", ["ComprasClienteAdminModule"] );
adminModule.controller("AdminClienteController", function($rootScope, $scope, $http){
  $rootScope.titulo = "Mis Compras ";
  $rootScope.tiendaSelected = null;
  $scope.isVistaDetalle = false;
  $rootScope.menuAccionClienteOn = true;
  $("#menuAccionCliente").css("display","");

 console.log("Menu Cliente Controller");
  $scope.$on("$destroy", function() {
    $rootScope.menuAccionClienteOn = false;
  }); 

  //$rootScope.selecciono( 0 );


})
.directive("miscompras", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/adminCliente/comprasCliente.html"
  };
})
.directive("afiliate", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/registro.html"
  };
}).directive("perfilcliente", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/adminCliente/miperfilcliente.html"
  };
});
