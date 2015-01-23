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
                               'RegistroClienteModule',
                               'MenuModule'
                               ]);    

    myApp.controller( "TianguisController", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope){
        $scope.modal={login:"modal/login-module.html",
                     contactus:"modal/contact-us.html"};
        $scope.template={footer:"footer.html", menu:"menu.html"};
        $rootScope.viewToolbar = true;  
    }])
    
    .directive("carrusel", function( ){
        return {
            restrict:"E",
            templateUrl:"component/carrusel.html"
        };
    })
    .directive("categorias", function( ){
        return {
            restrict:"E",
            templateUrl:"component/categorias.html"
        };
    })
    .directive("catalogos", function( ){
        return {
            restrict:"E",
            templateUrl:"component/catalogos.html"
        };
    })
    .directive("items", function( ){
        return {
            restrict:"E",
            templateUrl:"component/items.html"
        };
    })
    .directive("post", function( ){
        return {
            restrict:"E",
            templateUrl:"component/post.html"
        };
    })
    .directive("galeria", function( ){
        return {
            restrict:"E", 
            templateUrl:"component/galeria.html"
        };
    })
    .directive("marcas", function( ){
        return {
            restrict:"E", 
            templateUrl:"component/marcas.html"
        };
    })
    .directive("subscription", function( ){
        return {
            restrict:"E", 
            templateUrl:"component/subscription.html"
        };
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
});

