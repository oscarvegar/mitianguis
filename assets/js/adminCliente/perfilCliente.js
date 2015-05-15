var miperfil = angular.module("PerfilClienteModule",[]);
miperfil.controller("PerfilClienteAdminController", function($scope, $http,FileUploader, $window){
      $scope.init = function(){
      	    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
      	    $http.get("/getUserCurrent/"+usuario.username).then(function(result){  
      	    console.log(result);   
      	    		$scope.user = {};
                $scope.user= angular.copy(result.data);
                if($scope.user.imagenPrincipal){
                     $scope.imagenPerfil = true;
                }else{
                     $scope.imagenPerfil = false;
                }
      	  });	

      },

      $scope.imgPrincipalUploadPerfil = new FileUploader(
        {url: "/guardarArchivoPerfil",
          filters: [{
            name: 'extension',
            // A user-defined filter
            fn: function(item) {
              if(item.type.indexOf("image") < 0 ){
                item = null;
                console.log(" debes subir una imagen");
                return false;
              }
              console.log(" se subio la imagen");
              return true;
            }
           }]
          });

      $scope.engineSubmit = function(){
           if(!$scope.checked){
           	 $scope.user.password = null;
           }
           $scope.master = {};
           $http.post("/registroCliente/updateUserClient",{usuario:$scope.user})
           .success(function(data, status, headers, config){
           		$scope.user= angular.copy($scope.master);
              $scope.alert('success', 'Cambio de Información  Exitoso', 'Se guardaron los cambios con exito..');

           })
           .error(function(data, status, headers, config){
  				  $scope.alert('danger', 'Error', 'Error al acutalzar los datos'); 
           });

      },

       $scope.updateImage = function(){
           var itemIndexImgPrincipal = $scope.imgPrincipalUploadPerfil.getNotUploadedItems().length - 1;
           var objRequest = {
              pathBase: webUtil.getOrigin(),
              usuario: $scope.user.username,
              tipoArchivo: "ImagenPrincipal"
           };

           var itemImgPrincipal = $scope.imgPrincipalUploadPerfil.getNotUploadedItems()[itemIndexImgPrincipal];
           itemImgPrincipal.formData = [{infoPerfil: JSON.stringify(angular.copy(objRequest))}];

           $scope.imgPrincipalUploadPerfil.onCompleteAll = function (error, data) {
             $('#pictuteProfileModalClient').modal('hide');
             var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
             $http.get("/getUserCurrent/"+usuario.username).then(function(result){  
              $scope.user.imagenPrincipal = result.data.imagenPrincipal;
             console.log("nueva imagen");
             console.log($scope.user.imagenPrincipal);
             });
           }
           itemImgPrincipal.upload();

           
      
      },


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
      $scope.init();


});