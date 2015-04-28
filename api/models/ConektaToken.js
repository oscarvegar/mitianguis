/**
* ConektaToken.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    conektaToken : { type: 'string' }, // token id
    creditDebitCardMask : { type: 'string' }, // XXXX-XXXX-XXXX-0127
    financialServiceBrand : { type: 'string' }, // VISA
    mercante : { model: 'mercante' }
  }

};

