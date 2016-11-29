'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:extensionwindow
 * @description
 * # extensionwindow
 */
angular.module('CloudBoxes')
  	.directive('extensionwindow', function () {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				
				angular.element(element[0].querySelector('.header')).bind("mousedown", function(e){
					console.log("mouse down");
					e.stopPropagation();
				});

				angular.element(element[0].querySelector('.header').querySelector('.options')).bind("mousedown", function(e){
					e.stopPropagation();
				});

				
			}
    	};
  	});
