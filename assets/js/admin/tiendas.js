/**
 * Created by oscar on 26/03/15.
 */
var tiendaModule = angular.module("TiendaAdminModule",["angularFileUpload", "AdminService"]);
tiendaModule.controller("TiendaController", function($rootScope, $scope, $http, FileUploader, $tiendaService){
  var tiendaCtrl = this;

  // Recuperando bandera que proviene de Registrar un nuevo mercante, unicamente para
  // un mensaje indidcando que su registro fue exitoso
  if( webUtil.get("isNewMercante") ){
    $('#exitoNuevoMercanteModal').modal('show');
    webUtil.destroy("isNewMercante");
  }

  tiendaCtrl.origin = webUtil.getOrigin();
  tiendaCtrl.isDetalle = false;
  console.log("origin :: " + tiendaCtrl.origin );
  tiendaCtrl.mistiendas = null;
  tiendaCtrl.tienda = null;
  tiendaCtrl.tiendaSelected = null;
  tiendaCtrl.tituloModal = "Crea una nueva tienda";
  tiendaCtrl.btnLabel = "Crear Tienda" ;
  tiendaCtrl.isNuevaTienda = true ;
  tiendaCtrl.uploader = new FileUploader({url: "/nuevatienda" });
  tiendaCtrl.uploaderEdit = new FileUploader({url: "/editartienda" });
  tiendaCtrl.clear = function(){
    tiendaCtrl.tienda = null;
  }

  tiendaCtrl.setTiendaSelected = function( tienda ){
    tiendaCtrl.tiendaSelected = tienda;
  }

  tiendaCtrl.verDetalle = function( tienda ){
    tiendaCtrl.isDetalle = true;
    tiendaCtrl.tiendaSelected = tienda;
  }

  tiendaCtrl.setAsNuevaTienda = function(isNuevaTienda, tienda){
    tiendaCtrl.isDetalle = false;
    tiendaCtrl.isNuevaTienda = isNuevaTienda;
    if(isNuevaTienda){
      tiendaCtrl.clear();
      tiendaCtrl.tituloModal = "Crea una nueva tienda";
      tiendaCtrl.btnLabel = "Crear Tienda" ;
      tiendaCtrl.urlProcess = "/nuevatienda";
    }else{
      tiendaCtrl.tituloModal = "Edita la información de tu tienda";
      tiendaCtrl.btnLabel = "Aplicar cambios" ;
      tiendaCtrl.tienda = angular.copy( tienda );
      tiendaCtrl.urlProcess = "/editartienda" ;
    }
  }

  tiendaCtrl.getTiendas = function(){

    $http.get("/mistiendas/" + webUtil.getJSON("usuario").mercante.id).then(function(result){
      tiendaCtrl.mistiendas = result.data;
      $tiendaService.setTiendas(angular.copy(result.data));
      if (!tiendaCtrl.mistiendas) {
        tiendaCtrl.mistiendas = new Array();
      }
      tiendaCtrl.mistiendas.push({nombre: 'Nuevo'});
    });

  }

  tiendaCtrl.crear = function(){
    var item;
    tiendaCtrl.tienda.mercante = webUtil.getJSON("usuario").mercante.id;
    tiendaCtrl.tienda.descripcion = $("#descripcionTienda").val();
    var maxItems = tiendaCtrl.uploader.getNotUploadedItems().length;
    var itemIndex = maxItems - 1;
    if(tiendaCtrl.isNuevaTienda) {
      tiendaCtrl.tienda.logo = tiendaCtrl.origin;
      tiendaCtrl.uploader.formData = [{tienda: tiendaCtrl.tienda}];
      item = tiendaCtrl.uploader.getNotUploadedItems()[itemIndex];
    } else {
      tiendaCtrl.uploaderEdit.formData = [{tienda: tiendaCtrl.tienda}];
      item = tiendaCtrl.uploaderEdit.getNotUploadedItems()[itemIndex];
    }
    if (item) {
      tiendaCtrl.tienda.logo = tiendaCtrl.origin;
      item.formData = [{tienda: JSON.stringify(tiendaCtrl.tienda)}];
      if(tiendaCtrl.isNuevaTienda) {
        tiendaCtrl.uploader.onCompleteAll = function () {
          $('#tiendaModal').modal('hide');
          tiendaCtrl.getTiendas()
          tiendaCtrl.clear();
        }
        item.upload();
      }else{
        tiendaCtrl.uploaderEdit.onCompleteAll = function () {
          $('#tiendaModal').modal('hide');
          tiendaCtrl.getTiendas()
          tiendaCtrl.clear();
        }
        item.upload();
      }
    } else {
      $http.post(tiendaCtrl.urlProcess, tiendaCtrl.tienda).then(function (result) {
        $('#tiendaModal').modal('hide');
        tiendaCtrl.getTiendas()
        tiendaCtrl.clear();
      });
    }
  }

  tiendaCtrl.borrarTienda = function(  ){
    $http.post("/asignaEstatus",{status:2, tienda:tiendaCtrl.tiendaSelected}).then(function(result){
      $('#tiendaDelModal').modal('hide');
      tiendaCtrl.getTiendas()
    });
  }

  tiendaCtrl.goDetalle = function(tiendabd){
    $rootScope.tiendaSelected = tiendabd;
    $rootScope.selecciono(1);
    $scope.isVistaDetalle = true;
  }

  tiendaCtrl.getTiendas();

});
