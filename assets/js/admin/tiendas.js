/**
 * Created by oscar on 26/03/15.
 */
var tiendaModule = angular.module("TiendaModule",[]);
tiendaModule.controller("TiendaController", function($scope, $http){
  var tienda = this;
  tienda.mistiendas = null;
  $http.get("/mistiendas", webUtil.getJSON("mercante")).then(function(result){
    //alert(JSON.stringify(result));
    tienda.mistiendas = result.data;
  });

})
