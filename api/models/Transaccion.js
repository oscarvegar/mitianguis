/**
* Transaccion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    conektaId : { type: 'string' },
    fechaCreacion: { type: 'datetime' },
    estado : { type: 'string' },
    moneda : { type: 'string' },
    descripcion : { type: 'string' },
    aplicadoAlDoc : { type: 'string' },
    importe : { type: 'float' },
    fechaRecepcion : { type: 'datetime' },
    comision : { type: 'float' },
    tipoTransaccion : { model: 'tipotransaccion' },
    mercante : { model: 'mercante' },
    metodoPago : { type: 'object' }
  }

};

