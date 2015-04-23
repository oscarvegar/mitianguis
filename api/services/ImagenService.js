module.exports = {
  PATH_IMAGE: "/opt/resources/mitianguis/imagenes/",
  PATH_ARCHIVOS: "/opt/resources/mitianguis/archivos/",
  IMAGE_NOT_FOUND: "noimageavailable.png",
  PATH_LOGO : function(){
    return this.PATH_IMAGE + "logos";
  },
  PATH_PRODUCTOS : function(){
    return this.PATH_IMAGE + "productos";
  },
  PATH_SUBPRODUCTOS : function(){
    return this.PATH_IMAGE + "subproductos";
  },
  PATH_ARCHIVO_PRODUCTOS : function(){
    return this.PATH_ARCHIVOS + "productos";
  },
  saveLogo: function( filename ){

  },
  getLogo: function( filename ){

  }
};
