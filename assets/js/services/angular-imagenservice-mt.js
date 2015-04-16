/**
 * Created by oscar on 3/04/15.
 */
var module = angular.module('ImagenService', []);
module.service('$imagenServiceMT', function( $q ){
  //this.mistiendas = null;
  this.saveOneImage= function( upload ){
    var deferred = $q.defer();
    var index = upload.getNotUploadedItems().length - 1;
    var item = upload.getNotUploadedItems()[index];
    if(item){
      upload.onCompleteAll = function () {
        deferred.resolve({ nombreArchivo: "" });
      }
      item.upload();
    }else{
      deferred.resolve({ nombreArchivo: "" });
    }

    return deferred.promise;
  }

});
