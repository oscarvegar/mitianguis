var adminModule = angular.module("AdminModule", ["TiendaAdminModule"] );
adminModule.controller("AdminController", function($rootScope, $scope, $http){
  $rootScope.titulo = "Mis Tiendas";
  $rootScope.tiendaSelected = null;
  $scope.isVistaDetalle = false;
  $rootScope.menuAccionOn = true;
  $("#menuAccion").css("display","");
  $scope.$on("$destroy", function() {
    $rootScope.menuAccionOn = false;
  });

})
.directive("tiendas", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/tiendas.html"
  };
})
.directive("productos", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/productos.html"
  };
})
.directive("ventas", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/ventas.html"
  };
})
.directive("miperfil", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/miperfil.html"
  };
})
.directive("red", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/mired.html"
  };
});
