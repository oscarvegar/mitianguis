/**
 * Created by oscar on 26/03/15.
 */
var module = angular.module("ProductosAdminModule",['angularFileUpload', 'AdminService', 'xeditable']);
module.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

module.controller("ProductosAdminController", function($scope, $http, FileUploader, $tiendaService, $filter){

  $scope.tiendaSelected = {};
  $scope.tiendasDisponibles = [];
  $scope.productosDisponibles = [];
  $scope.categorias = [];
  $scope.msgErrorImgPrincipal = "";
  $scope.msgErrorImgSecundaria = "";
  $scope.msgErrorArchivo = "";
  $scope.imgPrincipalUpload = new FileUploader(
    {url: "/guardarArchivoProducto",
      filters: [{
        name: 'extension',
        // A user-defined filter
        fn: function(item) {
          if(item.type.indexOf("image") < 0 ){
            item = null;
            $scope.msgErrorImgPrincipal = "Debe de subir una imagen";
            return false;
          }
          $scope.msgErrorImgPrincipal = "";
          return true;
        }
      }]});

  $scope.imgSecundariasUpload = new FileUploader(
    {url: "/guardarArchivoProducto",
      filters: [{
        name: 'extension',
        // A user-defined filter
        fn: function(item) {
          if(item.type.indexOf("image") < 0 ){
            item = null;
            $scope.msgErrorImgSecundaria = "Debe de subir una imagen";
            return false;
          }
          $scope.msgErrorImgSecundaria = "";
          return true;
        }
      }]});


  $scope.fileUpload = new FileUploader(
    {url: "/guardarArchivoProducto",
      filters: [{
        name: 'extension',
        // A user-defined filter
        fn: function(item) {
          if(item.type.indexOf("pdf") < 0 ){
            item = null;
            $scope.msgErrorArchivo = "Debe de subir un archivo PDF";
            return false;
          }
          $scope.msgErrorArchivo = "";
          return true;
        }
      }]});

  $scope.$on("mistiendas", function(){
    $scope.tiendasDisponibles = $tiendaService.getTiendas();
    if($scope.tiendasDisponibles.length && $scope.tiendasDisponibles.length > 0){
      $scope.tiendaSelected = angular.copy($scope.tiendasDisponibles[0]);
      $scope.getProductos();
    }
  });

  $scope.agregaCategoria = function(event){
    var catego = angular.copy($scope.categoriaElegida);
    if ($scope.categorias.indexOf(catego) == -1) {
      if(catego.indexOf("#") != 0 ){
        catego = "#" + catego;
      }
      $scope.categorias.push(catego);
    }
    $scope.categoriaElegida = "";
  };

  $scope.removerArchivoImagen = function( item ){
    $scope.imgSecundariasUpload.removeFromQueue(item);
  }

  $scope.removerCategoria = function( index ){
    $scope.categorias.splice(index, 1);
  }

  $scope.showStatus = function() {
    var selected = $filter('filter')($scope.tiendasDisponibles, {id: $scope.tiendaSelected.id});
    return ($scope.tiendaSelected.id && selected.length) ? selected[0].nombre : 'Not set';
  };

  $scope.getProductos = function (){
    $http.get("/productoPorTienda/" + $scope.tiendaSelected.id).then(function(result){
      $scope.productosDisponibles = result.data;
    });
  };

  $scope.registrarProducto = function(isValid){
    // Primero registramos el producto
    $scope.producto.categorias = $scope.categorias;
    $scope.producto.imagenesSecundarias = new Array();
    $scope.producto.subproductos = new Array();
    $scope.producto.archivos = new Array();
    $scope.producto.tienda = $scope.tiendaSelected.id;
    /*for(var i = 0; i < $scope.imgSecundariasUpload.getNotUploadedItems().length; i++){
      var item = $scope.imgSecundariasUpload.getNotUploadedItems()[i];
      $scope.producto.imagenesSecundarias.push( item.file.name );
    }*/
    $http.post( "/registraProducto", $scope.producto).then(function( result ){
      console.log(JSON.stringify(result));
      if(result.data === "" ){
        alert("No se registro el producto");
        return;
      }
      var objRequest = { userId:  webUtil.getJSON("usuario").id,
                         producto: result.data,
                         tipoArchivo: "ImagenPrincipal"};

      // Preparando carga de archivos unicos
      var itemIndexImgPrincipal = $scope.imgPrincipalUpload.getNotUploadedItems().length - 1;
      var itemImgPrincipal = $scope.imgPrincipalUpload.getNotUploadedItems()[itemIndexImgPrincipal];


      var itemIndexPdf = $scope.fileUpload.getNotUploadedItems().length - 1;
      var itemArchivoPdf = $scope.fileUpload.getNotUploadedItems()[itemIndexPdf];

      if( itemImgPrincipal ) {
        itemImgPrincipal.formData = [{infoProductos:JSON.stringify(angular.copy(objRequest))}];
        itemImgPrincipal.upload();
      }

      if( itemArchivoPdf ) {
        objRequest.tipoArchivo = "archivoPdf";
        itemArchivoPdf.formData = [{infoProductos:JSON.stringify(angular.copy(objRequest))}];
        itemArchivoPdf.upload();
      }

      // Guardando imagenes multiples secundarias
      var tam = $scope.imgSecundariasUpload.getNotUploadedItems().length;
      if(tam > 0){
        objRequest.tipoArchivo = "ImagenSecundaria";
        var objRequestInstr = JSON.stringify(angular.copy(objRequest));
        for(var i = 0; i < tam; i++){
          $scope.imgSecundariasUpload.getNotUploadedItems()[i].formData = [{infoProductos:objRequestInstr}];
        }
        $scope.imgSecundariasUpload.uploadAll();
      }
      $('#productoModal').modal('hide');
    });
  };

  $scope.registrarTest = function(isValid){
    var objRequest = { userId:  webUtil.getJSON("usuario").id,
      producto: $scope.producto,
      tipoArchivo: "ImagenSecundaria"};
    console.log( JSON.stringify(objRequest) );
    $scope.imgSecundariasUpload.formData = [{infoProductos:angular.copy(objRequest)}];
    // Guardando imagenes multiples secundarias
    var tam = $scope.imgSecundariasUpload.getNotUploadedItems().length;
    if(tam > 0){
      for(var i = 0; i < tam; i++){
        $scope.imgSecundariasUpload.getNotUploadedItems()[i].formData = [{infoProductos:angular.copy(objRequest)}];
      }
      $scope.imgSecundariasUpload.uploadAll();
    }
  };


  /*
   $('.textarea').wysihtml5({
   "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
   "emphasis": true, //Italics, bold, etc. Default true
   "lists": false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
   "html": false, //Button which allows you to edit the generated HTML. Default false
   "link": true, //Button to insert a link. Default true
   "image": false, //Button to insert an image. Default true,
   "color": false //Button to change color of font
   });
   */


});


