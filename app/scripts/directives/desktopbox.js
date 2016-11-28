'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:draggable
 * @description
 * # draggable
 */
angular.module('CloudBoxes')
    .directive('desktopbox', function ($timeout) {
        return {
            replace: true,
            template: "<div class='desktopfolder' ng-class=\"{'selected':selected}\"><i class='fa fa-folder' aria-hidden='true'></i><p>{{model.title}}</p></div>",
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                element[0].style.left = (scope.model.position.x) + 'px';
                element[0].style.top = (scope.model.position.y) + 'px';

                scope.dragging = false;
                scope.model.selected = false; 
                scope.selected = false;
                scope.breakEvent = false;
                scope.draginitpost = {
                    x: 0,
                    y: 0,
                }
                element.bind('mousedown', function (e) {
                    scope.$parent.$parent.$broadcast('unselect', element);
                    scope.breakEvent = false;
                    scope.selected = true;
                    scope.model.selected = true;
                    scope.draginitpost.x = e.offsetX;
                    scope.draginitpost.y = e.offsetY;
                    e.stopPropagation();
                    $timeout(function () {
                        if (!scope.breakEvent) {
                            scope.dragging = true;
                        }
                    }, 100);
                });

                element.bind('click', function (e) {
                    scope.$emit('clickonbox');
                    e.stopPropagation();
                });

                element.bind('mouseup', function (e) {
                    scope.breakEvent = true;
                    scope.dragging = false;
                });

                angular.element(document).bind('mousemove', function (e) {
                    e.stopPropagation();
                    if (scope.dragging) {
                        element[0].style.position = 'absolute';
                        element[0].style.top = (e.clientY - scope.draginitpost.y) + 'px';
                        element[0].style.left = (e.clientX - scope.draginitpost.x) + 'px';
                    }
                });

                scope.$on('unselect', function (event, target) {
                    if (!target || target != element) {
                        scope.$apply(function () {
                            scope.selected = false;
                            scope.model.selected = false;
                        });
                    }
                });

                scope.$on('selectorRectangle', function (event) {
                    var d0 = element.position(),
                        d1 = $(".selectorRect").position(),
                        x11 = d0.left,
                        y11 = d0.top,
                        x12 = d0.left + element.width(),
                        y12 = d0.top + element.height(),
                        x21 = d1.left,
                        y21 = d1.top,
                        x22 = d1.left + $(".selectorRect").width(),
                        y22 = d1.top + $(".selectorRect").height(),
                        x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21)),
                        y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));

                    var intersectOverlap = x_overlap * y_overlap;
                    if (intersectOverlap > 0) {
                        scope.$apply(function () {
                            scope.selected = true;
                            scope.model.selected = true;
                        });
                    } else {
                        scope.$apply(function () {
                            scope.selected = false;
                            scope.model.selected = false;
                        });
                    }
                });
            },
            scope: {
                model: "="
            }
        };
    });
