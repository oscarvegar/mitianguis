/**
 * Created by oscar on 3/04/15.
 */
var module = angular.module('AdminService', []);
module.service('$tiendaService', function(){
  this.mistiendas = null;
  this.setTiendas = function( mistiendas ){
    this.mistiendas  = mistiendas;
  }
  this.getTiendas = function(){
    return this.mistiendas;
  }
});
