'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:draggable
 * @description
 * # draggable
 */
angular.module('CloudBoxes')
    .directive('box', function ($timeout, IconManager, $rootScope) {
        return {
            replace: true,
            template: "<div class='desktopfolder' ng-class=\"{'selected':model.selected, 'col-md-2':bootstrapped === true}\"><i ng-if='itemIconData.type == \"fa\"' ng-class='itemIconData.data' aria-hidden='true'></i><p>{{model.title}}</p></div>",
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                element[0].style.left = (scope.model.position.x) + 'px';
                element[0].style.top = (scope.model.position.y) + 'px';
                scope.model.selected = false; 
                scope.itemIconData = IconManager.getIcon(scope.model.extension);

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
                            scope.model.selected = true;
                        });
                    } else {
                        scope.$apply(function () {
                            scope.model.selected = false;
                        });
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

                $rootScope.$on('refreshIcon', function (event, target) {
                    console.log(IconManager.getIcon(scope.model.extension));
                    scope.itemIconData = IconManager.getIcon(scope.model.extension);
                });
            },
            scope: {
                model: "=",
                bootstrapped: "="
            }
        };
    });
