var menuModule = angular.module("MenuModule",[]);
menuModule.controller("MenuController",
function($scope, $http){
    var mc = this;
    mc.categorias = null;
    // Carga de categorias
    $http.get("/categoriasMenu").then(
        function(results){
            mc.categorias = results.data;
        }
    );
    
});
