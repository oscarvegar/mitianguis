var adminModule = angular.module("AdminModule", ["TiendaAdminModule"] );
adminModule.controller("AdminController", function($rootScope, $scope, $http){
  $rootScope.titulo = "Mis Tiendas";
  $rootScope.tiendaSelected = null;
  $scope.isVistaDetalle = false;
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
});
