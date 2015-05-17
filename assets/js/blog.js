angular.module("BlogModule",['flow'])
.controller('BlogCtrl', function($scope,$http,$location,$sce,$timeout,$rootScope,FileUploader){
	$scope.editTitulo = false;
	$scope.blog = {titulo:"* Clic aqui para editar el titulo *",articulo:"* Clic aqui para editar el articulo *"}
	
	$scope.editarTitulo = function(bol){
		$scope.editTitulo = bol;
		document.getElementById('blog.titulo').focus()
	}

	

	$scope.borrarImagen = function(){
		console.log($scope.flow.files[0])
	}

	

}).config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        target: '/blog/uploadImage',
        permanentErrors:[404, 500, 501]
    };
    // You can also set default events:
    flowFactoryProvider.on('catchAll', function (event) {
      	console.info(event)
    });
    // Can be used with different implementations of Flow.js
    // flowFactoryProvider.factory = fustyFlowFactory;
}]).directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});;