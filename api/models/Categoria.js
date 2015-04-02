/**
* Categoria.js
*
* @description :: Representa una categoria a la cual se le podran asignar otras categorias y/o productos.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      nombre:{
          type:'string',
          required:true
      },
      descripcion:{
          type:'string',
          required:false
      },
      subcategoria:{
          model:'categoria',
          required:false
      },
      clicks:{
          type:'integer',
          required:false
      }
  }
};
