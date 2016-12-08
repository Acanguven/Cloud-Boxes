'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:selectorrect
 * @description
 * # selectorrect
 */
angular.module('CloudBoxes')
    .directive('selectorrect', ['$interval',function ($interval) {
        return {
            template: '<div class="selectorRect" ng-show="selectorRect.visible"></div>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope, element, attrs) {
                scope.selectorRect = {
                    startX: 0,
                    startY: 0,
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    visible: false
                }

                $interval(function () {
                    if (scope.selectorRect.visible) {
                        element.css("width", scope.selectorRect.width);
                        element.css("height", scope.selectorRect.height);
                        element.css("left", scope.selectorRect.x);
                        element.css("top", scope.selectorRect.y);
                    }
                }, 0);

                scope.selectionStarted = false;
                scope.mousedowned = false;
                

                scope.mousedown = function (e) {
                    var mousex = e.pageX - scope.targetOffset.left;
                    var mousey = e.pageY - scope.targetOffset.top;
                    scope.mousedowned = true;
                    scope.selectorRect.x = mousex;
                    scope.selectorRect.y = mousey;
                    scope.selectorRect.startX = mousex;
                    scope.selectorRect.startY = mousey;
                    scope.selectorRect.width = 0;
                    scope.selectorRect.height = 0;
                    element.css("width", scope.selectorRect.width);
                    element.css("height", scope.selectorRect.height);
                    element.css("left", scope.selectorRect.x);
                    element.css("top", scope.selectorRect.y);
                    e.stopPropagation();
                }

                scope.mousemove = function (e) {
                    if (scope.mousedowned) {
                        var mousex = e.pageX - scope.targetOffset.left;
                        var mousey = e.pageY - scope.targetOffset.top;
                        if (scope.selectorRect.visible) {
                            scope.selectorRect.width = mousex - scope.selectorRect.x;
                            scope.selectorRect.height = mousey - scope.selectorRect.y;

                            if (mousey < scope.selectorRect.startY) {
                                scope.selectorRect.height = scope.selectorRect.startY - mousey;
                                scope.selectorRect.y = mousey;
                            }

                            if (mousex < scope.selectorRect.startX) {
                                scope.selectorRect.width = scope.selectorRect.startX - mousex;
                                scope.selectorRect.x = mousex;
                            }
                        } else {
                            var a = scope.selectorRect.startX - mousex
                            var b = scope.selectorRect.startY - mousey
                            var distance = Math.sqrt(a * a + b * b);
                            if (distance > 10) {
                                scope.selectorRect.visible = true;
                                scope.rectangleflag = true;
                            }
                        }
                    }
                }

                scope.mouseup = function (e) {
                    if (scope.selectorRect.visible) {
                        scope.$parent.$broadcast('selectorRectangle', { x: scope.selectorRect.x, y: scope.selectorRect.y, width: scope.selectorRect.width, height: scope.selectorRect.height });
                    }
                    scope.selectorRect.visible = false;
                    scope.mousedowned = false;
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
                

                angular.element(document).ready(function () {
                    if ($(scope.target).attr("id") == "deskTopElement") {
                        scope.targetOffset = getOffset(scope.target);
                    } else {
                        scope.$watch(function () {
                            return $(scope.target).parent().offset().left.toString() + $(scope.target).parent().offset().top.toString()
                        }, function () {
                            scope.targetOffset = {
                                left: (scope.target).parent().offset().left,
                                top: (scope.target).parent().offset().top + 25,
                            }
                        });
                        scope.targetOffset = {
                            left: (scope.target).parent().offset().left,
                            top: (scope.target).parent().offset().top + 25,
                        }
                    }
                });

                angular.element(scope.target).bind("mousedown", scope.mousedown);
                angular.element(scope.target).bind("mousemove", scope.mousemove);
                angular.element(scope.target).bind("mouseup", scope.mouseup);
            },
            scope: {
                target: "=",
                rectangleflag: "="
            }
        };
    }]);
