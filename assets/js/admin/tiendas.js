/**
 * Created by oscar on 26/03/15.
 */
var tiendaModule = angular.module("TiendaAdminModule",["angularFileUpload"]);
tiendaModule.controller("TiendaController", function($scope, $http, FileUploader){
  var tiendaCtrl = this;
  tiendaCtrl.mistiendas = null;
  tiendaCtrl.tienda = null;
  tiendaCtrl.uploader = new FileUploader({url:"/nuevatienda"});

  tiendaCtrl.clear = function(){
    tiendaCtrl.tienda = null;
  }

  tiendaCtrl.getTiendas = function(){
    $http.get("/mistiendas/" + webUtil.getJSON("usuario").mercante.id).then(function(result){
      tiendaCtrl.mistiendas = result.data;
      if (!tiendaCtrl.mistiendas) {
        tiendaCtrl.mistiendas = new Array();
      }
      tiendaCtrl.mistiendas.push({nombre: 'Nuevo'});
    });
  }

  tiendaCtrl.crear = function(){
    tiendaCtrl.uploader.formData = [{tienda:tiendaCtrl.tienda}];
    var item = tiendaCtrl.uploader.getNotUploadedItems()[0];
    tiendaCtrl.tienda.mercante = webUtil.getJSON("usuario").mercante.id;
    item.formData=[{tienda:JSON.stringify(tiendaCtrl.tienda)}];
    tiendaCtrl.uploader.onCompleteAll = function(){
      $('#tiendaModal').modal('hide');
      tiendaCtrl.getTiendas()
      tiendaCtrl.clear();
    }
    item.upload();
  }

  tiendaCtrl.getTiendas();

});
