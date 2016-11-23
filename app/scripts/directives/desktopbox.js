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
            template: "<div class='desktopfolder'><i class='fa fa-folder' aria-hidden='true'></i><p>{{model.title}}</p></div>",
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.dragging = false;
                scope.breakEvent = false;
                scope.draginitpost = {
                    x: 0,
                    y: 0,
                }
                element.bind('mousedown', function (e) {
                    scope.breakEvent = false;
                    e.stopPropagation();
                    $timeout(function () {
                        if (!scope.breakEvent) {
                            scope.draginitpost.x = e.offsetX;
                            scope.draginitpost.y = e.offsetY;
                            scope.dragging = true;
                        } else {
                            element.addClass("selected");
                        }
                    }, 100);
                });

                element.bind('mouseup', function (e) {
                    scope.breakEvent = true;
                    scope.dragging = false;
                    e.stopPropagation();
                });

                angular.element(document).bind('mousemove', function (e) {
                    e.stopPropagation();
                    if (scope.dragging) {
                        element[0].style.position = 'absolute';
                        element[0].style.top = (e.clientY - scope.draginitpost.y) + 'px';
                        element[0].style.left = (e.clientX - scope.draginitpost.x) + 'px';
                    }
                });
            },
            scope: {
                model: "="
            }
        };
    });
