/**
* Subproducto.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		modelo:'string', 
  		imagen:'string', 
  		precio:'float', 
  		stock:'int',
  		producto:{
  			model:'producto',
  			required : true
  		}
  }
};

