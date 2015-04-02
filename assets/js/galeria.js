var galeriaModule = angular.module("GaleriaModule",[]);
galeriaModule.controller("GaleriaController", ["$scope", "$http", 
function($scope, $http){
    /*Gallery Filtering and Responsiveness Function
    *******************************************/
    var gallery = (function( $ ) {
        'use strict';
        var $grid = $('.gallery-grid'),
                $filterOptions = $('.filters'),
                $sizer = $grid.find('.shuffle__sizer'),
        init = function() {
            // None of these need to be executed synchronously
            setTimeout(function() {
                listen();
                setupFilters();
            }, 100);

            $grid.on('loading.shuffle done.shuffle shrink.shuffle shrunk.shuffle filter.shuffle filtered.shuffle sorted.shuffle layout.shuffle', function(evt, shuffle) {
                // Make sure the browser has a console
                if ( window.console && window.console.log && typeof window.console.log === 'function' ) {
                    console.log( 'Shuffle:' + evt.type );
                }
            });

            // instantiate the plugin
            $grid.shuffle({
                itemSelector: '.gallery-item',
                sizer: $sizer
            });
        },

        // Set up button clicks
        setupFilters = function() {
            var $btns = $filterOptions.children();
            $btns.on('click', function(e) {
                var $this = $(this),
                        isActive = $this.hasClass( 'active' ),
                        group = $this.data('group');
                        $('.filters .active').removeClass('active');
                        $this.addClass('active');

                // Filter elements
                $grid.shuffle( 'shuffle', group );
                e.preventDefault();
            });

            $btns = null;
        },

        listen = function() {
            var debouncedLayout = $.throttle( 300, function() {
                $grid.shuffle('update');
            });

            // Get all images inside shuffle
            $grid.find('img').each(function() {
                var proxyImage;

                // Image already loaded
                if ( this.complete && this.naturalWidth !== undefined ) {
                    return;
                }

                // If none of the checks above matched, simulate loading on detached element.
                proxyImage = new Image();
                $( proxyImage ).on('load', function() {
                    $(this).off('load');
                    debouncedLayout();
                });

                proxyImage.src = this.src;
            });

            // Because this method doesn't seem to be perfect.
            setTimeout(function() {
                debouncedLayout();
            }, 500);
        };

        return {
            init: init
        };
    }( jQuery ));	
	
    /************************************************************************/

    gallery.init();
    $('.gallery-grid').lightGallery({
        speed: 400
    });
}]);




