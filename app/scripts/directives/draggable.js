'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:draggable
 * @description
 * # draggable
 */
angular.module('CloudBoxes')
    .directive('draggable', function ($interval) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
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

                scope.mousedown = function (e) {
                    var mouse = getNativeMouse(e);
                    scope.dragInfo.startx = mouse.x;
                    scope.dragInfo.starty = mouse.y;
                    scope.dragInfo.currentx = mouse.x;
                    scope.dragInfo.currenty = mouse.y;
                    scope.dragInfo.offsetX = element.offset().left - e.pageX;
                    scope.dragInfo.offsetY = element.offset().top - e.pageY;
                    element.css("zIndex", 10000);
                    scope.mousedowned = true;
                    e.stopPropagation();
                }

                scope.mousemove = function (e) {
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
                }

                scope.mouseup = function (e) {
                    scope.mousedowned = false;
                    scope.dragging = false;
                    element.css("zIndex", scope.startzIndex);
                }

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
                });

                scope.startzIndex = element.css("zIndex");


                $interval(function () {
                    if (scope.dragging) {
                        element.css("left", scope.dragInfo.currentx + scope.dragInfo.offsetX);
                        element.css("top", scope.dragInfo.currenty + scope.dragInfo.offsetY);
                    }
                }, 0);

                element.bind("mousedown", scope.mousedown);
                element.parent().bind("mousemove", scope.mousemove);
                element.bind("mouseup", scope.mouseup);
            }
        };
    });
