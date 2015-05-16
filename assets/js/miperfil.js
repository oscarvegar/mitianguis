/**
 * Created by oscarm on 13/04/15.
 */
var miperfil = angular.module("MiPerfilModule",[]);
miperfil.controller("PerfilAdminController", function($scope, $http,FileUploader, $window){
      $scope.init = function(){
      	    console.log("antes de la peticion");
      	    var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
      	    $http.get("/getUserCurrent/"+usuario.username).then(function(result){  
      	    		$scope.user = {};
      	    		
                $scope.user= angular.copy(result.data);
                console.log("******copy angular*******");
                console.log($scope.user);
                console.log("*****************");
                if($scope.user.imagenPrincipal){
                     $scope.imagenPerfil = true;
                }else{
                     $scope.imagenPerfil = false;
                }

      		});	

      },

      $scope.imgPrincipalUploadPerfil = new FileUploader(
        {url: "/guardarArchivoPerfil",
          removeAfterUpload: true,
          queueLimit : 1,
          filters: [{
            name: 'extension',
            // A user-defined filter
            fn: function(item) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
               var cadena = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
               if(cadena !== -1 ){
                  return true;

               }else{
                  document.getElementById("imgPrincipalPerfil").value = "";   
                  $scope.alert('warn', 'Error', 'Debes subir una imagen');
                  return false;

               }
            }
           }]
          });


      $scope.engineSubmit = function(){
           if(!$scope.checked){
             $scope.user.password = null;
           }
           $scope.master = {};
           $http.post("/registro/test",{usuario:$scope.user})
           .success(function(data, status, headers, config){
           		$scope.user= angular.copy($scope.master);
               $scope.alert('success', 'Cambio de Información  Exitoso', 'Se guardaron los cambios con exito..');

           })
           .error(function(data, status, headers, config){
  				console.log("error al actualizar el usuario");       
           $scope.alert('danger', 'Error', 'Error al acutalzar los datos');   	               


           });

      },


      $scope.updateImage = function(){
           /*var itemIndexImgPrincipal = $scope.imgPrincipalUploadPerfil.getNotUploadedItems().length - 1;
           var objRequest = {
              pathBase: webUtil.getOrigin(),
              usuario: $scope.user.username,
              tipoArchivo: "ImagenPrincipal"
           };

           var itemImgPrincipal = $scope.imgPrincipalUploadPerfil.getNotUploadedItems()[itemIndexImgPrincipal];
           itemImgPrincipal.formData = [{infoPerfil: JSON.stringify(angular.copy(objRequest))}];

           $scope.imgPrincipalUploadPerfil.onCompleteAll = function (error, data) {
             $('#pictuteProfileModal').modal('hide');
             var usuario = JSON.parse( $window.localStorage.getItem("usuario") );
             $http.get("/getUserCurrent/"+usuario.username).then(function(result){  
              $scope.user.imagenPrincipal = result.data.imagenPrincipal;
             console.log("nueva imagen");
             console.log($scope.user.imagenPrincipal);
             });
           }
           itemImgPrincipal.upload();*/

           var itemIndexImgPrincipal = $scope.imgPrincipalUploadPerfil.getNotUploadedItems().length - 1;
           var objRequest = {
              pathBase: webUtil.getOrigin(),
              usuario: $scope.user.username,
              tipoArchivo: "ImagenPrincipal"
           };

           var itemImgPrincipal = $scope.imgPrincipalUploadPerfil.getNotUploadedItems()[itemIndexImgPrincipal];
           if(itemIndexImgPrincipal >= 0){
                itemImgPrincipal.formData = [{infoPerfil: JSON.stringify(angular.copy(objRequest))}];

                itemImgPrincipal.onComplete = function (response, status, headers) {
                $('#pictuteProfileModal').modal('hide');
                console.log('onComplete', response[0].imagenPrincipal); 
                $scope.user.imagenPrincipal = response[0].imagenPrincipal;
                document.getElementById("imgPrincipalPerfil").value = "";
                }
                itemImgPrincipal.upload();
          }
           
      
      },

      $scope.cancel = function(){
          $scope.imgPrincipalUploadPerfil.clearQueue();
          document.getElementById("imgPrincipalPerfil").value = "";

      },


      $scope.alert = function(tipo,title,desc){
      $scope.messageTitle = title;
      $scope.messageDescription = desc;
      switch(tipo){

          case 'warn':
              $scope.alertClass = "alert-warning";
              $scope.infoIcon = "icon-exclamation-sign";
              $scope.showWarn = true; 
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
