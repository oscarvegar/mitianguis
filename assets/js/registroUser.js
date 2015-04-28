var registro = angular.module( "RegistroUserModule", [] );


registro.controller( "RegistroUserController", function($scope, $http, $rootScope) {


  $scope.registrarUser = function() {

    console.log("Registro usuario");
    console.log($scope.user);


    $http.post("/registrarUser", $scope.user).then(function(result) {
      console.log("Respuesta User");
      console.log( JSON.stringify(result) );
      $scope.alert('success', 'Registro Exitoso', 'Favor de revisar tu correo electrónico  para que activar tu cuenta');
    });


  };


} );





