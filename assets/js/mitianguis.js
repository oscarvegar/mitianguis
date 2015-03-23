var myApp = angular.module("TianguisApp", 
                              ['ngAnimate',
                               'ngRoute',
                               'CarruselModule',
                               'CategoriasModule',
                               'CatalogosModule',
                               'ItemsModule',
                               'PostModule',
                               'GaleriaModule',
                               'MarcasModule',
                               'SubscriptionModule',
                               'ToolbarModule',
                               'RegistroModule',
                               'MenuModule'
                               ]);

myApp.controller( "TianguisController", function($scope, $http, $rootScope){
    $scope.modal={login:"../modal/login-module.html",
                 contactus:"../modal/contact-us.html"};
    $scope.template={footer:"../footer.html", menu:"../menu.html"};
    $scope.categorias = null;
    //Obtener al mercante en base al subdominio en el primer acceso.
    var subdominio = webUtil.getDomain();
    $http.get("/mercanteByUrl?urlMercante=" + subdominio)
    .then(function(result){
    	//console.log( JSON.stringify(result.data) );
    	if( result.data.mentor ){
    		//Guardar Local
    		localStorage["mercante"] = JSON.stringify(result.data);
    		
    	}
    	
        // Carga de categorias
        $http.get("/categoriasMenu").then(
            function(results){
            	$scope.categorias = results.data;
            }
        );
    });
})
.directive("toolbar", function( ){
    return {
        restrict:"E", 
        templateUrl:"component/toolbar.html"
    };
});
        
myApp.config(function( $routeProvider, $locationProvider){
    $routeProvider.when('/', {templateUrl: 'inicio.html'});
    $routeProvider.when('/registroweb', {templateUrl: 'registro.html'});
    $routeProvider.when('/registroClienteWeb', {templateUrl: 'registroCliente.html'});
    $routeProvider.when('/soporte', {templateUrl: 'soporte.html'});
    $routeProvider.when('/mercantes', {templateUrl: 'mercante.html'});
    
    // Limpiando variables en localstore
    localStorage.clear();
    
});

