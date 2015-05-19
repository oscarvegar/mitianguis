/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
	'/login': {
	    controller: 'AuthController',
	    action: 'process'
	 },
	'/logout': {
	    controller: 'AuthController',
	    	action: 'logout'
	},
  
  '/activarCuenta/:codigo': {
      controller: 'AuthController',
        action: 'activarCuenta'
  },

	'post /registro': 'RegistroController.registrarNuevo',
	//'GET /categoriasMenu': 'CategoriaController.categoriasMenu',
	'GET /mercante': 'MercanteController.find',
  'GET /mercanteByUrl': 'MercanteController.findByUrlMercante',
  'GET /producto/:id':'ProductoController.findById',
  'POST /mercanteByUsuario':'MercanteController.findByUsuario',
  'POST /conekta/response': 'ConektaController.responseConekta',
  'post /registroCliente': 'RegistroClienteController.registrarClienteNuevo',
  'post /recuperarPassword':'RegistroController.recuperarPassword',
  'POST /registrarUser': 'RegistroController.registrarUser',

  'get /': 'TiendaController.index',
  'get /det/:id': 'TiendaController.index',
  'get /store': 'TiendaController.index',
  //'get /store': {view:'homepage'},
  
  'GET /share/:id': 'ShareController.shareP',

  /*** ADMINISTRACION DE TIENDAS ***/
  'GET /mistiendas/:id': 'TiendaController.findByMercante',
  'POST /nuevatienda': 'TiendaController.create',
  'POST /editartienda': 'TiendaController.editar',
  'POST /asignaEstatus': 'TiendaController.setStatus',
  'GET /misventas/:id/:status': 'VentaController.misVentas',
  'POST /misventasStatus/:id/:status': 'VentaController.misVentasStatus',

  /*** ADMINISTRACION DE PRODUCTOS ***/
  'GET /productoPorTienda/:id': 'ProductoController.productoByTienda',
  'POST /registraProducto':'ProductoController.registraProducto',
  'POST /actualizarProducto':'ProductoController.actualizarProducto',
  'POST /guardarArchivoProducto':'ProductoController.guardarArchivo',
  'POST /borrarProducto':'ProductoController.borrarProducto',
  'POST /carmbiarArchivo':'ProductoController.carmbiarArchivo',


  'GET /cotizacion': 'LoadShippingController.getCotizacionPedido',
  'GET /seguimiento': 'LoadShippingController.getSeguimientoPedido',

   'GET /getUserCurrent/:username': 'RegistroController.getUserCurrent',


  /*** FUNCIONES GENERALES ***/
  'GET /getImagen/:imagen':'ImagenController.getImagen',
  'GET /getImagenProducto/:imagen':'ImagenController.getImagenProducto',
  'GET /getImagenSubProducto/:imagen':'ImagenController.getImagenSubProducto',
  'GET /getImagenPerfil/:imagen':'ImagenController.getImagenPerfil',
  'GET /getImagenBlog/:imagen':'ImagenController.getImagenBlog',
  'POST /guardarArchivoPerfil':'RegistroController.guardarArchivoPerfil',


  /*** ADMINISTRACION DE CLIENTES ***/
  'GET /comprasCliente/:id/:status':'VentaController.comprasCliente',


  /*** BLOG ???? ***/
  'GET /blog/crear':'BlogController.crear',
  'GET /blog/all':'BlogController.all',
  'GET /blog/upload':'BlogController.upload',
  'GET /blog/:id':'BlogController.findById',
  'GET /b/:id':'BlogController.renderBlog',
  'GET /blog':'BlogController.renderMain'






  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
