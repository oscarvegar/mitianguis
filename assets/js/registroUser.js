var registro = angular.module( "RegistroUserModule", [] );


registro.controller( "RegistroUserController", function($scope, $http, $rootScope,$window) {

console.log("Entra registro user");
  $scope.blockRegister=false;
  $scope.showAlertDanger = false; 
  $scope.showAlert = false;
  $scope.errorLogin = false;
  $scope.submitted = false;
  

  $scope.user = {};

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
               $scope.showAlertDanger = true; 
              break;
          default:
              $scope.alertClass = "alert-success";
              $scope.infoIcon = "icon-check-sign";
              $scope.showAlert = true;
              break;

      }
  
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
    
    console.log($scope.userRegister);

    $http.post("/registrarUser", $scope.userRegister).then(function(result) {
      console.log("Respuesta User");
      console.log( JSON.stringify(result) );
      $scope.user = {};
      $scope.blockRegister=true;
      $scope.showAlertDanger = false; 
      $scope.alert('success', 'Registro Exitoso', 'Favor de revisar tu correo electrónico  para que activar tu cuenta');
    },function(err){
    	console.log("ERROR",err);
       $scope.submitted = false;
       $scope.showAlert = false;
    	 $scope.alert('danger', 'Registro Duplicado', 'Ese correo electrónico ya se encuentra registrado favor de cambiarlo.');
	    
	  });
  };


} );





