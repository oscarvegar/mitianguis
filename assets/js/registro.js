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
    $scope.registrar = function(isValid) {
        //$http.post("/clienteExpress");
         $scope.$broadcast('show-errors-check-validity');
        if( isValid ){
            $http.post("/registro", $scope.mercante)
            .success( function(data, status){
                alert("Success: " + JSON.stringify(data));
            })
            .error(function(data, status){
                alert("Error: " + JSON.stringify(data));
            });
        }else{
            //alert("El form es invalido");
        }
    }
    
} );





