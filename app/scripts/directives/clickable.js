'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:clickable
 * @description
 * # clickable
 */
angular.module('CloudBoxes')
    .directive('clickable', function (ExtensionManager) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                scope.lastClickTime = 0;

                scope.click = function (e) {
                    scope.$parent.$broadcast('unselect', element);
                    if (Date.now() - scope.lastClickTime < 500) {
                        scope.$$childHead.$emit('clickonbox');
                        scope.$$childHead.model.selected = false;
                        scope.clickTrigger();
                    } else {
                        scope.$$childHead.$emit('clickonbox');
                        scope.$$childHead.model.selected = true;
                    }
                    scope.lastClickTime = Date.now();
                    e.stopPropagation();
                };

                scope.clickTrigger = function () {
                    scope.clickFeatures = ExtensionManager.getClickBindings(scope.$$childHead.model.extension);
                    for (var x = 0; x < scope.clickFeatures.length; x++) {
                        scope.clickFeatures[x].action(scope.clickFeatures[x].extensionid, scope.$$childHead.model);
                    }
                }

                scope.$on('unselect', function (event, target) {
                    if (!target || target != element) {
                        if (scope.$$childHead) {
                            scope.$apply(function () {
                                scope.$$childHead.model.selected = false;
                            });
                        }
                    }
                });

                element.bind('click', scope.click);
            }
        };
    });
