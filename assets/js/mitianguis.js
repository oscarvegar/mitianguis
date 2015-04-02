var myApp = angular.module("TianguisApp",
                              ['ngAnimate',
                               'ngRoute',
                               'AdminModule',
                                'TiendaModule',
                               'RegistroModule',
                               'CarruselModule',
                               'TiendaModule',
                               'CarritoModule',
                               'ProductoModule',
                                'TiendaAdminModule'
                               ]);

myApp.controller( "TianguisController", function($scope, $http, $rootScope, $location){

    $scope.modal={login:"../modal/login-module.html",
                 contactus:"../modal/contact-us.html"};
    $scope.template={footer:"../footer.html", menu:"../menu.html"};
    $scope.showAlert = false;
    $scope.alertClass = "";
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


    $scope.alert = function(tipo,title,desc){
            $scope.messageTitle = title;
            $scope.messageDescription = desc;
            switch(tipo){
                
                case 'warn':
                    $scope.alertClass = "alert-warning";
                    $scope.infoIcon = "icon-exclamation-sign";
                    break;
                case 'info':
                    $scope.alertClass = "alert-info";
                    $scope.infoIcon = "icon-lightbulb";
                    break;
                case 'danger':
                    $scope.alertClass = "alert-danger";
                    $scope.infoIcon = "icon-remove-sign";
                    break;
                default:
                    $scope.alertClass = "alert-success";
                    $scope.infoIcon = "icon-check-sign";
                    break;
                    
            }
            
            $scope.showAlert = true;
    };

    $scope.forgotPassword = function(){
        console.log("Recuperar Password");
        console.log($scope.forgotMail);

            $http.post('/recuperarPassword',{email:$scope.forgotMail}).success(function(data){
                if(data.code > 0)
                    console.log("Datos");
                    console.log(data);
                     //alert("Success: " + JSON.stringify(data));
                    $scope.alert('success','Recuperar Contraseña','Se ha enviado un correo a tu cuenta');
            });
    };



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
    $routeProvider.when('/carrito', {templateUrl: 'pages/store/carrito.html'});

    //localStorage.clear();
});

myApp.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});


