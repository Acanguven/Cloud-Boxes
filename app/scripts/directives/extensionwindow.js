'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:extensionwindow
 * @description
 * # extensionwindow
 */
angular.module('CloudBoxes')
  	.directive('extensionwindow', function ($interval) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				/* Dragging Features */

                scope.dragging = false;
                scope.mousedowned = false;
                scope.dragInfo = {
                    startx: 0,
                    starty: 0,
                    currentx: 0,
                    currenty: 0,
                    offsetX: 0,
                    offsetY: 0,
                }
                angular.element(element[0].querySelector('.header')).bind("mousedown", function (e) {
                    if (scope.windowStatus === 1) {
                        var mouse = getNativeMouse(e);
                        scope.dragInfo.startx = mouse.x;
                        scope.dragInfo.starty = mouse.y;
                        scope.dragInfo.currentx = mouse.x;
                        scope.dragInfo.currenty = mouse.y;
                        scope.dragInfo.offsetX = element.offset().left - e.pageX;
                        scope.dragInfo.offsetY = element.offset().top - e.pageY;
                        scope.mousedowned = true;
                        e.stopPropagation();
                    }
                });

				angular.element(element[0].querySelector('.header').querySelector('.options')).bind("mousedown", function(e){
					e.stopPropagation();
                });

                element.bind("mouseup", function (e) {
                    scope.mousedowned = false;
                    scope.dragging = false;
                });

                var rnd = Math.random();
                $interval(function () {
                    if (scope.dragging) {
                        element.css("left", scope.dragInfo.currentx + scope.dragInfo.offsetX);
                        element.css("top", scope.dragInfo.currenty + scope.dragInfo.offsetY);
                    }
                }, 0);

                function getOffset(el) {
                    var _x = 0;
                    var _y = 0;
                    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                        _x += el.offsetLeft - el.scrollLeft;
                        _y += el.offsetTop - el.scrollTop;
                        el = el.offsetParent;
                    }
                    return { top: _y, left: _x };
                }

                function getNativeMouse(e) {
                    var mousex = e.pageX - scope.targetOffset.left;
                    var mousey = e.pageY - scope.targetOffset.top;
                    return { x: mousex, y: mousey };
                }

                angular.element(document).ready(function () {
                    scope.targetOffset = getOffset(element.parent()[0]);

                    element.parent().bind("mousemove", function (e) {
                        if (scope.mousedowned) {
                            var mouse = getNativeMouse(e);
                            if (scope.dragging) {
                                scope.dragInfo.currentx = mouse.x;
                                scope.dragInfo.currenty = mouse.y;
                            } else {
                                var a = scope.dragInfo.startx - mouse.x
                                var b = scope.dragInfo.starty - mouse.y
                                var distance = Math.sqrt(a * a + b * b);
                                if (distance > 10) {
                                    scope.dragging = true;
                                }
                            }
                        }
                    })
                });

                /*
                    Window Status 
                */

                scope.minimized = false;
                scope.windowStatus = 1; //1 normal //2 maximized

                scope.windowClose = function () {
                    console.log(element);
                    element.remove();
                }

                scope.minimize = function () {
                    scope.minimized = true;
                }

                scope.windowStatusUpdate = function (type) {
                    scope.windowStatus = type;
                }
			}
    	};
  	});
