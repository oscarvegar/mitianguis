var adminModule = angular.module("AdminModule", ["TiendaModule"] );
adminModule.controller("AdminController", function($scope, $http){
  $scope.titulo = "Mis Tiendas";
  $scope.menuOptions = new Array(5);
  $scope.menuOptions[0]="selected";
  $scope.selecciono = function( index ){
    for(var i = 0; i < $scope.menuOptions.length; i++){
      $scope.menuOptions[i]="";
    }
    $scope.menuOptions[index]="selected";
  }
})
.directive("tiendas", function( ){
  return {
    restrict:"E",
    templateUrl:"pages/admin/tiendas.html"
  };
});
