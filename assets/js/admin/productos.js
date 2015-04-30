/**
 * Created by oscar on 26/03/15.
 */
var module = angular.module("ProductosAdminModule",['angularFileUpload', 'AdminService', 'xeditable']);
module.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

module.controller("ProductosAdminController", function($rootScope, $timeout, $scope, $http, FileUploader, $tiendaService, $filter){

  $scope.tiendasDisponibles = [];
  $scope.productosDisponibles = [];
  $scope.categorias = [];
  $scope.msgErrorImgPrincipal = "";
  $scope.msgErrorImgSecundaria = "";
  $scope.msgErrorArchivo = "";
  $scope.msgErrorImagen = "";
  $scope.isNuevoProducto = true;
  $scope.titulo = "Nuevo Producto";
  $scope.vistas = new Array(3);
  $scope.accionBorrarArchivo = null;
  $scope.cambioImagenUpload =  new FileUploader( );
  $scope.IMAGEN_PRINCIPAL = 1;
  $scope.IMAGEN_SECUNDARIA = 2;
  $scope.ARCHIVO= 3;
  $scope.imgSecuUrlTemp = null;
  $scope.isImagenPrincipalConURL = false;
  $scope.isImagenSecuConURL = false;
  $scope.isImagenActURL = false;
  $scope.imagenActURL = null;
  $scope.producto={ imagenesSecundarias:[] };

  $scope.agregaImgSecuUrl = function(){
    $scope.producto.imagenesSecundarias.push( angular.copy($scope.imgSecuUrlTemp) );
    $scope.imgSecuUrlTemp = null;
  }

  $scope.removerArchivoImagenUrl = function( index ){
    $scope.producto.imagenesSecundarias.splice(index, 1);
  }

  $scope.mostrarInputImgAct = function( isUrlInput ){
    $scope.isImagenActURL = isUrlInput;
  }

  $scope.mostrarInputImgPrincipal = function( isUrlInput ){
    $scope.isImagenPrincipalConURL = isUrlInput;
  }

  $scope.mostrarInputImgSecu = function( isUrlInput ){
    $scope.isImagenSecuConURL = isUrlInput;
  }


  $scope.setView = function( index ){
    for(var i = 0; i < $scope.vistas.length; i++){
      $scope.vistas[i]='none';
    }
    $scope.vistas[index]='';

    if( index === constants.VIEW_MODELOS_PRODUCTO ){
      $http.get("/Producto/findById/" + $scope.productoSelected.id).then( function(result){
        $scope.productoSelected = result.data;
      });
    }

  }

  $scope.setView(0);

  $rootScope.$watch('tiendaSelected', function(){
    if($rootScope.tiendaSelected) {
      $scope.getProductos();
    }
  })

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

  $scope.cambiarArchivoUpload = new FileUploader(
    {url: "/carmbiarArchivo",
      filters: [{
        name: 'extension',
        // A user-defined filter
        fn: function(item) {
          if(item.type.indexOf("pdf") < 0 && item.type.indexOf("image") < 0 ){
            item = null;
            $scope.msgErrorCamiarArchivo = "El tipo de archivo es incorrecto";
            return false;
          }
          $scope.msgErrorCamiarArchivo = "";
          return true;
        }
      }]});

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
    $http.get("/productoPorTienda/" + $rootScope.tiendaSelected.id).then(function(result){
      $scope.productosDisponibles = result.data;
    });
  };

  $scope.registrarProducto = function(isValid){

    $scope.producto.categorias = $scope.categorias;
    if( !$scope.isNuevoProducto ){
      //Es una actualizacion

      $http.post("/actualizarProducto", $scope.producto).then(function(result){
        $scope.getProductos();
        $('#productoModal').modal('hide');
      });
      return;
    }

    // Primero registramos el producto
    if( !$scope.isImagenSecuConURL ) {
      $scope.producto.imagenesSecundarias = new Array();
    }
    $scope.producto.subproductos = new Array();
    $scope.producto.archivos = new Array();
    $scope.producto.tienda = $scope.tiendaSelected.id;
    $http.post( "/registraProducto", $scope.producto).then(function( result ) {
      console.log(JSON.stringify(result));
      if (result.data === "") {
        alert("No se registro el producto");
        return;
      }
      var objRequest = {
        userId: webUtil.getJSON("usuario").id,
        producto: result.data,
        pathBase: webUtil.getOrigin(),
        tipoArchivo: "ImagenPrincipal"
      };

      // Preparando carga de archivos unicos
      var itemIndexImgPrincipal = $scope.imgPrincipalUpload.getNotUploadedItems().length - 1;
      var itemImgPrincipal = $scope.imgPrincipalUpload.getNotUploadedItems()[itemIndexImgPrincipal];
      var itemIndexPdf = $scope.fileUpload.getNotUploadedItems().length - 1;
      var itemArchivoPdf = $scope.fileUpload.getNotUploadedItems()[itemIndexPdf];


      if (!$scope.isImagenPrincipalConURL) {
        if (itemImgPrincipal) {
          itemImgPrincipal.formData = [{infoProductos: JSON.stringify(angular.copy(objRequest))}];
          $scope.imgPrincipalUpload.onCompleteAll = function () {
            $scope.getProductos();
            $('#productoModal').modal('hide');
          }
          itemImgPrincipal.upload();
        }
      }else{
        $scope.getProductos();
        $('#productoModal').modal('hide');
      }

      if( itemArchivoPdf ) {
        objRequest.tipoArchivo = "archivoPdf";
        itemArchivoPdf.formData = [{infoProductos:JSON.stringify(angular.copy(objRequest))}];
        itemArchivoPdf.upload();
      }

      // Guardando imagenes multiples secundarias
      if(!$scope.isImagenSecuConURL) {
        var tam = $scope.imgSecundariasUpload.getNotUploadedItems().length;
        if (tam > 0) {
          objRequest.tipoArchivo = "ImagenSecundaria";
          var objRequestInstr = JSON.stringify(angular.copy(objRequest));
          for (var i = 0; i < tam; i++) {
            $scope.imgSecundariasUpload.getNotUploadedItems()[i].formData = [{infoProductos: objRequestInstr}];
          }
          $scope.imgSecundariasUpload.uploadAll();
        }
      }

    });
  };

  $scope.formatoCategoria = function( catego ){
    if(catego) {
      catego += "";
      return catego.replace("[", "");
    }
  }

  $scope.setProductoSelected = function( producto ){
    $scope.productoSelected = producto;
  }

  $scope.setAsNuevoProducto = function( isNuevo, producto  ){
    $scope.isNuevoProducto = isNuevo;
    $scope.producto = angular.copy(producto);
    if( isNuevo ){
      $scope.titulo = "Nuevo Producto";
    }else{
      $scope.categorias = producto.categorias;
      $scope.titulo = "Edición de Producto";
    }
  }

  $scope.borrarProducto = function(){
    $http.post("/borrarproducto", $scope.productoSelected).then(function(result){
      $scope.getProductos();
      $('#productoDelModal').modal('hide');
    });
  }

  $scope.initImagenes = function(){
    $scope.imagenesSecundariasTemp = angular.copy( $scope.productoSelected.imagenesSecundarias );
    $scope.archivosTemp = angular.copy( $scope.productoSelected.archivos );
    if( !$scope.imagenesSecundariasTemp ) $scope.imagenesSecundariasTemp = new Array();
    if( !$scope.archivosTemp ) $scope.archivosTemp = new Array();

    $scope.imagenesSecundariasTemp.push( "../../imagenes/add.png" );
    $scope.archivosTemp.push( {nombre:"add", url:"../../imagenes/add.png"} );
  }

  $scope.borrarImagenPrincipal = function() {
    var request = {id:$scope.productoSelected.id, imagenPrincipal:constants.PATH_IMAGE_NOT_AVAILABLE};
    $http.post("/actualizarProducto", request).then( function( result ){
      $scope.productoSelected.imagenPrincipal = constants.PATH_IMAGE_NOT_AVAILABLE;
    });
  }

  $scope.borrarArchivoDetalle = function( ){
    if( $scope.accionBorrarArchivo === $scope.ARCHIVO ){
      $scope.productoSelected.archivos.splice($scope.index, 1);
      var request = {id:$scope.productoSelected.id,
                     archivos:$scope.productoSelected.archivos};
      $http.post("/actualizarProducto", request).then(function(result){
        $scope.archivosTemp.splice($scope.index, 1);
      });
    }else if( $scope.accionBorrarArchivo === $scope.IMAGEN_SECUNDARIA ){
      $scope.productoSelected.imagenesSecundarias.splice( $scope.index, 1 );
      var request = {id:$scope.productoSelected.id,
                     imagenesSecundarias:$scope.productoSelected.imagenesSecundarias};
      $http.post("/actualizarProducto", request).then(function(result){
        $scope.productoSelected = result.data;
        $scope.imagenesSecundariasTemp.splice( $scope.index, 1 );
      });
    }else if( $scope.accionBorrarArchivo === $scope.IMAGEN_PRINCIPAL ){
      $scope.borrarImagenPrincipal();
    }
    $('#archivoDelModal').modal('hide');
  }

  $scope.prepararCambiarImagenPrincipal = function(){

    $scope.infoProducto = { userId:  webUtil.getJSON("usuario").id,
                            producto: $scope.productoSelected,
                            pathBase: webUtil.getOrigin(),
                            tipoArchivo: "ImagenPrincipal"};
    $scope.tituloCambiaArchivo = "IMAGEN";
    $scope.labelCambiaArchivo = "Selecciona una imagen";
    $('#prodCambiaImgModal').modal('show');
  }

  $scope.prepararCambiarImagenSecundria = function(indice){
    $scope.infoProducto = { userId:  webUtil.getJSON("usuario").id,
      producto: $scope.productoSelected,
      pathBase: webUtil.getOrigin(),
      tipoArchivo: "ImagenSecundaria",
      index:indice};
    $scope.tituloCambiaArchivo = "IMAGEN";
    $scope.labelCambiaArchivo = "Selecciona una imagen";
    $('#prodCambiaImgModal').modal('show');
  }

  $scope.prepararCambiarArchivo = function(indice){
    $scope.infoProducto = { userId:  webUtil.getJSON("usuario").id,
      producto: $scope.productoSelected,
      pathBase: webUtil.getOrigin(),
      tipoArchivo: "archivoPdf",
      index:indice};
    $scope.tituloCambiaArchivoPdf = "AGREGA UN NUEVO ARCHIVO PDF";
    $scope.labelCambiaArchivoPdf = "Selecciona un archivo";
    $('#prodCambiaArchivoModal').modal('show');
  }

  $scope.cambiarImagen = function(){
    if( $scope.infoProducto.tipoArchivo === "ImagenPrincipal" ){
      if( $scope.isImagenActURL ) {
        var request = {id:$scope.productoSelected.id,
                       imagenPrincipal:$scope.imagenActURL};
        $http.post("/actualizarProducto", request).then(function(result){
          $scope.productoSelected.imagenPrincipal = angular.copy($scope.imagenActURL);
          $scope.imagenActURL = null;
          $('#prodCambiaImgModal').modal('hide');
        });
      }else{
        var itemIndexImgPrincipal = $scope.imgPrincipalUpload.getNotUploadedItems().length - 1;
        var itemImgPrincipal = $scope.imgPrincipalUpload.getNotUploadedItems()[itemIndexImgPrincipal];
        if (itemImgPrincipal) {
          itemImgPrincipal.formData = [{infoProductos: JSON.stringify(angular.copy($scope.infoProducto))}];
          $scope.imgPrincipalUpload.onCompleteAll = function () {
            $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
              $scope.productoSelected = result.data;
              $('#prodCambiaImgModal').modal('hide');
            });
          }
          itemImgPrincipal.upload();
        }
      }

    }else if( $scope.infoProducto.tipoArchivo === "ImagenSecundaria" ){
      if( $scope.isImagenActURL ) {
        if($scope.infoProducto.index ) {
          $scope.productoSelected.imagenesSecundarias[$scope.infoProducto.index] = $scope.imagenActURL;
        }else{
          $scope.productoSelected.imagenesSecundarias.push($scope.imagenActURL);
        }
        var request = {id:$scope.productoSelected.id,
          imagenesSecundarias:$scope.productoSelected.imagenesSecundarias};
        $http.post("/actualizarProducto", request).then(function(result) {
          $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
            $scope.productoSelected = result.data;
            $scope.initImagenes();
            $('#prodCambiaImgModal').modal('hide');
            $scope.imagenActURL = null;
          });
        });
      }else {
        var tam = $scope.cambiarArchivoUpload.getNotUploadedItems().length;
        if (tam > 0) {
          var objRequestInstr = JSON.stringify(angular.copy($scope.infoProducto));
          for (var i = 0; i < tam; i++) {
            $scope.cambiarArchivoUpload.getNotUploadedItems()[i].formData = [{infoProductos: objRequestInstr}];
          }
          $scope.cambiarArchivoUpload.onCompleteAll = function () {
            $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
              $scope.productoSelected = result.data;
              $scope.initImagenes();
              $('#prodCambiaImgModal').modal('hide');
            });
          }
          $scope.cambiarArchivoUpload.uploadAll();
        }
      }
    }
  }

  $scope.cambiarArchivoPdf = function(){
      var itemIndexPdf = $scope.cambiarArchivoUpload.getNotUploadedItems().length - 1;
      var itemArchivoPdf = $scope.cambiarArchivoUpload.getNotUploadedItems()[itemIndexPdf];
      if (itemArchivoPdf) {
        var objRequestInstr = JSON.stringify(angular.copy($scope.infoProducto));
        itemArchivoPdf.formData = [{infoProductos: objRequestInstr}];
        $scope.cambiarArchivoUpload.onCompleteAll = function () {
          $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
            $scope.productoSelected = result.data;
            $scope.initImagenes();
            $('#prodCambiaArchivoModal').modal('hide');
          });
        }
        itemArchivoPdf.upload();
      }
  }

  $scope.viewDialogDelArchivo = function( accion, index ){
    $scope.accionBorrarArchivo = accion;
    $scope.index = index;
    $('#archivoDelModal').modal('show');
    if( accion === $scope.ARCHIVO ){
      $scope.dlgTitulo="CONFIRMACION BORRAR ARCHIVO";
      $scope.dlgMensaje="¿Esta seguro de borrar el archivo seleccionado.?";
    }else{
      $scope.dlgTitulo="CONFIRMACION BORRAR IMAGEN";
      $scope.dlgMensaje="¿Esta seguro de borrar la imagen seleccionada.?";
    }
  }

  //**** Modelos  ****/
  $scope.isImagenSubProdURL = false;

  $scope.mostrarInputImgSubProd = function( opc ){
    $scope.isImagenSubProdURL = opc;
  }

  $scope.accionSubProducto = function( ){
    $scope.subproducto.producto = $scope.productoSelected.id;
    if( $scope.isNewSubProducto ) {
      $http.post("/Producto/createSubProducto", $scope.subproducto).then(function (result) {
        if ($scope.isImagenSubProdURL) {
          $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
            $scope.productoSelected = result.data;
            $scope.subproducto = null;
            $scope.subproductoForm.$setPristine(true);
            $('#subProductoModal').modal('hide');
          });
        }else{
          //upload file
          $scope.infoProducto = { userId:  webUtil.getJSON("usuario").id,
                                  producto: result.data,
                                  pathBase: webUtil.getOrigin(),
                                  tipoArchivo: "subproductos"};
          var tam = $scope.cambiarArchivoUpload.getNotUploadedItems().length;
          if (tam > 0) {
            var objRequestInstr = JSON.stringify(angular.copy($scope.infoProducto));
            for (var i = 0; i < tam; i++) {
              $scope.cambiarArchivoUpload.getNotUploadedItems()[i].formData = [{infoProductos: objRequestInstr}];
            }
            $scope.cambiarArchivoUpload.onCompleteAll = function () {
              $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
                $scope.productoSelected = result.data;
                $scope.subproducto = null;
                $scope.subproductoForm.$setPristine(true);
                $('#subProductoModal').modal('hide');
              });
            }
            $scope.cambiarArchivoUpload.uploadAll();
          }
        }
      });
    } else {
      $http.post("/Producto/actualizarSubProducto", $scope.subproducto).then(function(result){
        if(!$scope.isImagenSubProdURL){

          //upload file
          $scope.infoProducto = { userId:  webUtil.getJSON("usuario").id,
                                  producto: result.data,
                                  pathBase: webUtil.getOrigin(),
                                  tipoArchivo: "subproductos"};
          var tam = $scope.cambiarArchivoUpload.getNotUploadedItems().length;
          if (tam > 0) {
            var objRequestInstr = JSON.stringify(angular.copy($scope.infoProducto));
            for (var i = 0; i < tam; i++) {
              $scope.cambiarArchivoUpload.getNotUploadedItems()[i].formData = [{infoProductos: objRequestInstr}];
            }
            $scope.cambiarArchivoUpload.onCompleteAll = function () {
              $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
                $scope.productoSelected = result.data;
                $scope.subproducto = null;
                $scope.subproductoForm.$setPristine(true);
                $('#subProductoModal').modal('hide');
              });
            }
            $scope.cambiarArchivoUpload.uploadAll();
          }
          // ****************************************************
        }
        $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
          $scope.productoSelected = result.data;
          $scope.subproducto = null;
          $scope.subproductoForm.$setPristine(true);
          $('#subProductoModal').modal('hide');
        });
      });
    }
  }

  $scope.isPrincipal = "active";
  $scope.setIsPrincipal = function( isPrincipal ){
    $scope.producto.isPrincipal = isPrincipal;
    if( isPrincipal ){
      $scope.isPrincipal = "active";
      $scope.notIsPrincipal = "";
    }else{
      $scope.isPrincipal = "";
      $scope.notIsPrincipal = "active";
    }
  }

  $scope.setSubProductoSelected = function( subproducto ){
    $scope.subProductoSelected = subproducto;
  }

  $scope.borrarSubProducto = function(){
    var request = {id: $scope.subProductoSelected.id,
                   status: constants.STATUS_ELIMINADO};
    $http.post("/Producto/actualizarSubProducto", request).then(function(result){
      $http.get("/producto/findById/" + $scope.productoSelected.id).then(function (result) {
        $scope.productoSelected = result.data;
        $('#subProdDelModal').modal('hide');
      });
    });
  }

  $scope.setAsNewSubProducto = function( subproducto, isNew ){
    $scope.subproducto = angular.copy(subproducto);
    $scope.isNewSubProducto = isNew;
    if( isNew ){
      $scope.tituloSubProductoModal = "Crea un nuevo Modelo";
    }else{
      $scope.tituloSubProductoModal = "Modifica la información de tu Modelo";
    }
  }

});


