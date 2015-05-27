angular.module("BlogModule",['angularFileUpload']) 
.controller('BlogCtrl', function($scope,$http,$timeout,$location,FileUploader,$routeParams,$rootScope){

    
	$scope.editTitulo = false;
	$scope.blog = {}
	$scope.uploader = new FileUploader({url: "/blog/upload" });
    $scope.uploader.onAfterAddingFile = function(item) {
        console.log("AHI VA PA ARRIBA")
        item.onSuccess = function(response, status, headers) {
            console.info("SUCCESS",response);
            $scope.blog.imagen=response.filename;
        };
        var res = item.upload();

    };
	$scope.editarTitulo = function(bol){
        $scope.editTitulo = bol;
		document.getElementById('blog.titulo').focus()
	}

    $scope.crear = function(){
        console.log($scope.blog)
        $http.post("/blog/crear",$scope.blog)
        .success(function(blog){
            $location.url('/admin/blog');

        }).error(function(err){
            console.error(err);
        })
    }

     $scope.autoExpand = function(e) {
        var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height =  scrollHeight + "px";    
    };
    function expand() {
        $scope.autoExpand('TextArea');
    }
  

    $scope.init = function(){
        console.info("ENTRA INIT BLOG",$rootScope.getQueryParam('b'))
        if($routeParams.blogId || $rootScope.getQueryParam('b')){
            $scope.mode="U"
            var bid = $rootScope.getQueryParam('b')?$rootScope.getQueryParam('b'):$routeParams.blogId;
            
            $http.get('/blog/'+bid)
            .success(function(blog){
                console.info("BLOG",blog)
                $scope.blog = blog;
            }).error(function(err){
                console.error(err);
            })
            return;
        }else{
            console.log("ENTRA A INIT BLOG")
            $http.get('/blog/all')
            .success(function(blogs){
                $scope.blogs = blogs;
                console.log("BLOGS LENGTH:",blogs)
            }).error(function(err){
                console.error(err);
            });
        }
    };
	$scope.init();

}).directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
}).directive('elastic', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, element) {
          var resize = function() {
            return element[0].style.height = "" + (element[0].scrollHeight) + "px";
          };
          element.on("blur keyup change load", resize);
          $timeout(resize, 50);
        }
      };
    }
  ]);

