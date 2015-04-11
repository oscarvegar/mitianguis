var adminModule = angular.module("AdminModule", ["TiendaAdminModule"] );
adminModule.controller("AdminController", function($rootScope, $scope, $http){
  $scope.titulo = "Mis Tiendas";
  $scope.menuOptions = new Array(6);
  for(var i = 0; i < $scope.menuOptions.length; i++){
    $scope.menuOptions[i]={selected:"",display:'none'};
  }
  $scope.menuOptions[0]={selected:"selected",display:''};
  $scope.selecciono = function( index ){
    for(var i = 0; i < $scope.menuOptions.length; i++){
      $scope.menuOptions[i]={selected:"",display:'none'};
    }
    $scope.menuOptions[index]={selected:"selected",display:''};
  }
  $scope.loadTiendas = function(){
    $rootScope.$broadcast("mistiendas");
  }
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
});
