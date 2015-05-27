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
                                'RedAdminModule',
                                'MiPerfilModule',
                                'validation.match',
                                'RegistroUserModule',
                                'AdminClienteModule',
                                'PerfilClienteModule',
                                'ComprasClienteAdminModule',
                                'BlogModule',
                               ]);

myApp.controller( "TianguisController", function($scope, $http, $rootScope, $location,$window, $sce,$rootScope){
    var redirectURL = document.getElementById('redirectURL');
    if(redirectURL){
      console.info("VIENE UN BLOG",redirectURL)
      $location.url(redirectURL.value);
    }
    $scope.modal={login:"../modal/login-module.html",
                 contactus:"../modal/contact-us.html"};
    $scope.template={footer:"../footer.html", menu:"../menu.html"};
    $scope.showAlert = false;
    $scope.showLogin = {val:true};
    $scope.showPassword = {val:false};
    $scope.alertClass = "";
    $scope.categorias = null;
    $scope.mercante = null;
    $scope.errorLogin = false;
    $scope.blockRegister=false;
    $scope.showAlertDanger = false; 
    $scope.submitted = false;
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
    if(subdominio.search("http")>=0) subdominio = "gameland";
    //if(subdominio !== "http://") {
	    $http.get("/mercanteByUrl?urlMercante=" + subdominio)
	    .then(function(result) {
        console.log( "Mercante obtenido del subdominio :: " + subdominio + " >> "  +  JSON.stringify(result) );
        if ( result.data == null ) {
	    		window.location.href = constants.DOMAIN + "pages/#/?subdomain=" + subdominio;
	    	} else if ( result.data.mercante.mentor ) {
          webUtil.save("mercante", result.data.mercante);
          webUtil.save("tienda", result.data);
          $rootScope.tienda = result.data;
	    	}
	    },function(error) {
	    	//window.location.href="tiendanoexiste";
	    } );
    //}

    //$http.get("/mercanteByUrl?urlMercante=" + subdominio)

    $scope.login = function(){
      $scope.user.email = $scope.user.username;
      $http.post("/login", $scope.user).then(function(result){
        console.log( JSON.stringify(result) );
        if( result.data.message === constants.LOGIN_SUCCESS ) {
          $('#loginModal').modal('hide');
          $scope.showLogin = {val:false};
          console.log("user usado para buscar mercante:: " + JSON.stringify(result.data.user) );
          if( result.data.user.perfil === "MERCANTE" ) {
            $http.post("/mercanteByUsuario", result.data.user).then(function (resultMerca) {
              console.log("mercante found :: " + JSON.stringify(resultMerca));
              result.data.user.mercante = resultMerca.data;
              webUtil.save("usuario", result.data.user);
              webUtil.save("email", result.data.user.username);
              $rootScope.usuario = result.data.user;           
              $scope.user ={};
              $scope.errorLogin = false;
              $scope.submitted = false;
            });
          } else {
            webUtil.save("usuario", result.data.user);
            webUtil.save("email", result.data.user.username);
            $rootScope.usuario = result.data.user;
            $scope.user ={};
            $scope.errorLogin = false;
            $scope.submitted = false;
          }
        } else {
           $scope.user ={};
          $scope.errorLogin = true;
          $scope.submitted = false;
        }
      });
    }


    $scope.showPassword = function(){
      $scope.showLogin = {val:false};
      $scope.show($scope.showPassword);
    };
    
    $scope.show = function(elem){
      
      $scope.showPassword.val = false;   
      elem.val = true;
      
    };

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
          console.log("Entro Danger");
          console.log(tipo);
              $scope.alertClass = "alert-danger";
              $scope.infoIcon = "icon-remove-sign";
               $scope.showAlertDanger = true;
              break;
          default:
              $scope.alertClass = "alert-success";
              $scope.infoIcon = "icon-check-sign";
              $scope.showAlert = true;
              break;

      }

    };

    $scope.forgotPassword = function() {
      console.log("Recuperar Password");
      console.log($scope.forgotMail);

           $http.post("/recuperarPassword", {email:$scope.forgotMail}).then(function(result) {
             $scope.showAlertDanger = false; 
             $scope.alert('success','Recuperar Contraseña','Se ha enviado un correo a tu cuenta');
          },function(err){
             $scope.showAlert = false;
             $scope.alert('danger', 'Registro No Existente', 'Ese correo no existe en el sistema, favor de registrarse.');
             console.log("ERROR",err);
          });
    };

    $scope.logout = function() {
        $scope.submitted = false;
        $http.get('/logout').success(function(datos){
        $window.localStorage.removeItem("usuario");
            $rootScope.usuario = null;
            delete $rootScope.usuario;
            window.location = 'http://mitianguis.mx/#/';
        });
    };


  $scope.registrarUser = function() {

    console.log("Registro usuario");
    console.log($scope.user);

    var subdominio = webUtil.getOrigin();
    var idMentor = JSON.parse( $window.localStorage.getItem("mercante") );

    $scope.userRegister = {}
    $scope.userRegister.username = $scope.user.username;
    $scope.userRegister.passwordUser = $scope.user.passwordUser;
    $scope.userRegister.subdominio = subdominio;
    $scope.userRegister.mentor = idMentor.usuario;

  //  console.log($scope.userRegister);


    $http.post("/registrarUser", $scope.userRegister).then(function(result) {
      console.log("Respuesta User");
      console.log( JSON.stringify(result) );
      $scope.user = {};
      $scope.blockRegister=true;
      $scope.showAlertDanger = false; 
      $scope.alert('success', 'Registro Exitoso', 'Favor de revisar tu correo electrónico  para que activar tu cuenta');
    },function(err){
       $scope.submitted = false;
       $scope.alert('danger', 'Registro Duplicado', 'Ese correo electrónico ya se encuentra registrado favor de cambiarlo.');
       console.log("ERROR",err);
    });


  };

  $rootScope.getQueryParam = function(param) {
    var found;
    window.location.search.substr(1).split("&").forEach(function(item) {
        if (param ==  item.split("=")[0]) {
            found = item.split("=")[1];
        }
    });
    return found;
};

  // PARA MENU DE ADMINISTRACION
  $rootScope.menuOptions = new Array(8);
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
    $routeProvider.when('/gracias', {templateUrl: 'pages/store/gracias.html'});
    $routeProvider.when('/registroUser', {templateUrl: 'pages/admin/registroUser.html'});
    $routeProvider.when('/cliente', {templateUrl: 'pages/adminCliente/menuCliente.html'});
    $routeProvider.when('/blog', {templateUrl: 'pages/store/blog.html'});
    $routeProvider.when('/admin/blog/crear', {templateUrl: 'pages/admin/crearBlog.html'});
    $routeProvider.when('/admin/blog', {templateUrl: 'pages/admin/blogs.html'});
    $routeProvider.when('/admin/blog/editar/:blogId', {templateUrl: 'pages/admin/crearBlog.html'});
    $routeProvider.when('/admin/ventas', {templateUrl: 'pages/admin/ventas.html'});
    $routeProvider.when('/admin/login', {templateUrl: 'pages/admin/login.html'});


    //localStorage.clear();
    Conekta.setPublishableKey("key_Oxhifz8dyqLeZ3xYqfGczng");



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

myApp.directive('onlyAlphanumeric', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attr, ctrl) {
      function inputValue(val) {
        if (val) {
          var digits = val.replace(/[^a-zA-Z0-9-]/, '');
          digits = digits.replace(/\s/g, "");
          digits = digits.toLowerCase();
          if (digits !== val) {
            ctrl.$setViewValue(digits);
            ctrl.$render();
          }
          return digits;
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

myApp.run(function(){
  document.getElementById('mainmain').style.display = 'inline';
  document.getElementById('mainloading').style.display = 'none';
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
