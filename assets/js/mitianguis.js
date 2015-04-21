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
                                'TiendaAdminModule',
                                'ProductosAdminModule',
                                'AdminService',
                                'CheckoutModule',
                                'VentasAdminModule',
                                'RedAdminModule'
                               ]);

myApp.controller( "TianguisController", function($scope, $http, $rootScope, $location,$window, $sce,$rootScope){

    $scope.modal={login:"../modal/login-module.html",
                 contactus:"../modal/contact-us.html"};
    $scope.template={footer:"../footer.html", menu:"../menu.html"};
    $scope.showAlert = false;
    $scope.alertClass = "";
    $scope.categorias = null;
    $scope.mercante = null;
    $scope.errorLogin = false;


    $rootScope.meses = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    $rootScope.selMes = "01";
    $rootScope.anos = ["15","16","17"];
    $rootScope.selAno = "17";


    $rootScope.menuAccionOn = false;

    $rootScope.trustAsHtml = function(value) {
      return $sce.trustAsHtml(value);
    };

    $rootScope.usuario = webUtil.getJSON("usuario");
    console.log( $rootScope.usuario );
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
        console.log( "Mercante obtenido del subdominio :: " + subdominio + " >> "  +  JSON.stringify(result) );
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
            $rootScope.usuario = result.data.user;
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

    $scope.logout = function(){
          $http.get('/logout').success(function(datos){
          $window.localStorage.removeItem("usuario");
              window.location = '/';
          });
      };

  // PARA MENU DE ADMINISTRACION
  $rootScope.menuOptions = new Array(7);
  for(var i = 0; i < $rootScope.menuOptions.length; i++){
    $rootScope.menuOptions[i]={selected:"",display:'none'};
  }
  $rootScope.menuOptions[0]={selected:"selected",display:''};
  $rootScope.selecciono = function( index ){
    for(var i = 0; i < $rootScope.menuOptions.length; i++){
      $rootScope.menuOptions[i]={selected:"",display:'none'};
    }
    $rootScope.menuOptions[index]={selected:"selected",display:'',show:true};
  }
  // *** FIN MENU DE ADMINISTRACION ***

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
  $routeProvider.when('/admin/mired', {templateUrl: 'pages/admin/mired.html'});
    $routeProvider.when('/soporte', {templateUrl: 'pages/soporte.html'});
    $routeProvider.when('/mercantes', {templateUrl: 'pages/mercante.html'});
    $routeProvider.when('/producto', {templateUrl: 'pages/store/detalleProducto.html'});
    $routeProvider.when('/carrito', {templateUrl: 'pages/store/carrito.html'});
  $routeProvider.when('/checkout', {templateUrl: 'pages/store/checkout.html'});

    //localStorage.clear();
    //Conekta.setPublishableKey("key_Oxhifz8dyqLeZ3xYqfGczng");



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

myApp.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
});

myApp.directive('validNumberFloat', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return;
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
          var val = '';
        }
        var clean = val.replace(/[^0-9\.]/g, '');
        var decimalCheck = clean.split('.');

        if(!angular.isUndefined(decimalCheck[1])) {
          decimalCheck[1] = decimalCheck[1].slice(0,2);
          clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});
/*
myApp.directive('richTextEditor', function() {
  return {
    restrict : "A",
    require : 'ngModel',
    replace : true,
    transclude : true,
    //template : '<div><textarea></textarea></div>',
    link : function(scope, element, attrs, ctrl) {
      var textarea = $("#" + element[0].id).wysihtml5({
        "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
        "emphasis": true, //Italics, bold, etc. Default true
        "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
        "html": false, //Button which allows you to edit the generated HTML. Default false
        "link": true, //Button to insert a link. Default true
        "image": false, //Button to insert an image. Default true,
        "color": false //Button to change color of font
      });
      var editor = $('#' + element[0].id).data("wysihtml5").editor;
      // view -> model
      editor.on('change', function() {
        scope.$apply(function () {
          ctrl.$setViewValue(editor.getValue());
        });
        if(editor.getValue()) {
          ctrl.$setValidity('required', true);
        }else{
          ctrl.$setValidity('required', false);
        }
      });

      // model -> view
      ctrl.$render = function() {
        textarea.html(ctrl.$viewValue);
        editor.setValue(ctrl.$viewValue);
      };

      ctrl.$render();
    }
  };
});*/
