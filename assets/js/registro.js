var registro = angular.module( "RegistroModule", [] );

registro.directive('showErrors', function($timeout) {
    return {
      restrict: 'A',
      require: '^form',
      link: function (scope, el, attrs, formCtrl) {
        // find the text box element, which has the 'name' attribute
        var inputEl   = el[0].querySelector("[name]");
        // convert the native text box element to an angular element
        var inputNgEl = angular.element(inputEl);
        // get the name on the text box
        var inputName = inputNgEl.attr('name');
        var classError = "glyphicon glyphicon-remove form-control-feedback";
        var classOk = "glyphicon glyphicon-ok form-control-feedback";
        // only apply the has-error class after the user leaves the text box
        var blurred = false;
        var spanError = $("#icono" + inputName);
        var divInput = $("#div" + inputName);
        var hasSuccesClass = "has-success";
        var hasErrorClass = "has-error";

        inputNgEl.bind('blur', function() {
            blurred = true;
            el.toggleClass('has-error', formCtrl[inputName].$invalid);
            if(formCtrl[inputName].$invalid){
                divInput.toggleClass(hasErrorClass, true);
                divInput.toggleClass(hasSuccesClass, false);
                spanError.toggleClass(classOk, false);
                spanError.toggleClass(classError, true);

            }else{
                divInput.toggleClass(hasErrorClass, false);
                divInput.toggleClass(hasSuccesClass, true);
                spanError.toggleClass(classError, false);
                spanError.toggleClass(classOk, true);
            }
        });

        scope.$watch(function() {
          return formCtrl[inputName].$invalid
        }, function(invalid) {
          // we only want to toggle the has-error class after the blur
          // event or if the control becomes valid

          if (!blurred && invalid) { return }
          el.toggleClass('has-error', invalid);
        });

        scope.$on('show-errors-check-validity', function() {
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });

        scope.$on('show-errors-reset', function() {
          $timeout(function() {
            el.removeClass('has-error');
          }, 0, false);
        });
      }
    }
  });

registro.controller( "RegistroController", function($scope, $http, $rootScope) {
    $rootScope.viewToolbar = false;
    $scope.showAlert = false;
    $scope.alertClass = "";
    var indexInit = window.location.origin.indexOf("//") + 2;
    var indexFin = window.location.origin.indexOf(".mitianguis");
    var urlMercanteFind = window.location.origin.substring( indexInit, indexFin );
    console.info(urlMercanteFind);
    $scope.mercante={mentor:{codigoMercante:null}};
    $scope.lecturaCodMerca = false;
    $http.get("/mercanteByUrl?urlMercante=" + urlMercanteFind).then(function(result){
    	console.log( "Mercante [" + urlMercanteFind + "] >> " + JSON.stringify(result) );
    	if( result.data.mercante ){
    		$scope.mercante.mentor.codigoMercante = result.data.mercante.codigoMercante;
    		$scope.lecturaCodMerca = true;
    	}else{
    		$scope.lecturaCodMerca = false;
    	}
    });

    $scope.registrar = function(isValid) {
      $scope.$broadcast('show-errors-check-validity');
      if( isValid ){
        $scope.mensajeErrorCodigoMercante = null;
        $http.post("/Mercante/findByCodigo/", {codigoMercante:$scope.mercante.mentor.codigoMercante} ).then(
          function(result) {
            var card = {card:$scope.datosPago};
            console.log(JSON.stringify(card));
            Conekta.token.create(card,
              function(data){
                var token = data.id;
                console.log( "Respuesta Conekta ::: " + JSON.stringify(data) );
                $http.post( "/Mercante/registrarNuevo/",
                  {mercante:$scope.mercante, usuario:$scope.usuario, token: token} )
                  .then(function(result){

                  },function(err){

                  });
              },
              function(err){
                console.log("ERROR",err)
              });
          }, function(err){
            //alert("Error: " + JSON.stringify(err) );
            $scope.registerForm.codigo.$setValidity('codigomercante', false);
            $scope.mensajeErrorCodigoMercante = err.data.mensaje +
                                                ".Verifique que haya escrito correctamente el código de mercante";
            $scope.$broadcast('show-errors-check-validity');
          }
        );
      }else{
        //alert("El form es invalido");
      }
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

} );





