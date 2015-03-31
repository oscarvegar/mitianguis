var myApp = angular.module("TianguisApp",
                              ['ngAnimate',
                               'ngRoute',
                               'AdminModule',
                                'TiendaModule',
                               'RegistroModule',
                               'CarruselModule',
                               'TiendaModule',
                               'ProductoModule',
                                'TiendaAdminModule'
                               ]);

myApp.controller( "TianguisController", function($scope, $http, $rootScope, $location){
    $scope.modal={login:"../modal/login-module.html",
                 contactus:"../modal/contact-us.html"};
    $scope.template={footer:"../footer.html", menu:"../menu.html"};
    $scope.categorias = null;
    $scope.mercante = null;
    $scope.errorLogin = false;
    $scope.usuario = webUtil.getJSON("usuario");
    console.log( $scope.usuario );
    // Obtener el subdominio erroneo, si existe
    var subdominioError = $location.search().subdomain;
    if(subdominioError){
    	return;
    }
    //Obtener al mercante en base al subdominio en el primer acceso.
    var subdominio = webUtil.getDomain();
    //if(subdominio !== "http://") {
	    $http.get("/mercanteByUrl?urlMercante=" + subdominio)
	    .then(function(result) {
        //console.log( JSON.stringify(result.data.mercante) );
        if ( result.data == null ) {
	    		window.location.href = constants.DOMAIN + "pages/#/?subdomain=" + subdominio;
	    	} else if ( result.data.mercante.mentor ) {
          webUtil.save("mercante", result.data.mercante);
          webUtil.save("tienda", result.data);
	    	}
	    },function(error) {
	    	window.location.href="tiendanoexiste";
	    } );
    //}

    $http.get("/mercanteByUrl?urlMercante=" + subdominio)

    $scope.login = function(){
      $scope.user.email = $scope.user.username;
      $http.post("/login", $scope.user).then(function(result){
        //console.log( JSON.stringify(result) );
        if( result.data.message === constants.LOGIN_SUCCESS ){
          $('#loginModal').modal('hide');
          console.log("user usado para buscar mercante:: " + JSON.stringify(result.data.user) );
          $http.post("/mercanteByUsuario", result.data.user).then( function( resultMerca ){
            console.log("mercante found :: " + JSON.stringify(resultMerca));
            result.data.user.mercante = resultMerca.data;
            webUtil.save("usuario", result.data.user);
            webUtil.save("email", result.data.user.username);
            $scope.usuario = result.data.user;
          });
        }else{
          $scope.errorLogin = true;
        }
      });
    }

})
/*.directive("toolbar", function( ){
    return {
        restrict:"E",
        templateUrl:"component/toolbar.html"
    };
});
*/
myApp.config(function( $routeProvider, $locationProvider){
    $routeProvider.when('/', {templateUrl: 'pages/store/inicio.html'});
    $routeProvider.when('/registro', {templateUrl: 'pages/store/registro.html'});
    $routeProvider.when('/admin', {templateUrl: 'pages/admin/main.html'});
    $routeProvider.when('/soporte', {templateUrl: 'pages/soporte.html'});
    $routeProvider.when('/mercantes', {templateUrl: 'pages/mercante.html'});
    $routeProvider.when('/producto', {templateUrl: 'pages/store/detalleProducto.html'});

    //localStorage.clear();
});

myApp.service('MetaInformation', function() {
  
  var metaDescription = '';
  var metaKeywords = '';
  return {
    metaDescription: function() { return metaDescription; },
    metaKeywords: function() { return metaKeywords; },
    reset: function() {
      metaDescription = '';
      metaKeywords = '';
    },
    setMetaDescription: function(newMetaDescription) {
      metaDescription = newMetaDescription;
    },
    appendMetaKeywords: function(newKeywords) {
      for (var key in newKeywords) {
        if (metaKeywords === '') {
          metaKeywords += newKeywords[key].name;
        } else {
          metaKeywords += ', ' + newKeywords[key].name;
        }
      }
    }
  };
});

