/**
* Mercante.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      items:{
          model:'item',
          via:'mercante'
      },
      carteras:{
          model:'cartera',
          via:'mercante'
      },
      mentor:{
          model:'mercante',
          required:true
      }
  }
};
