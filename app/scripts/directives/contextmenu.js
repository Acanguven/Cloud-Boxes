'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:contextmenu
 * @description
 * # contextmenu
 */
angular.module('CloudBoxes')
    .directive('contextmenu', function (ExtensionManager) {
        return {
            template: '<div class="context"><div class="contextLine text-info">{{selectionText}}</div><div class="contextLine" ng-repeat="feature in contextfeatures" ng-click="feature.action(feature.extensionid,targets)"><span><img ng-if="feature.img" ng-src="{{feature.img}}"/><i class="fa" ng-class="feature.fa"></i></span>  {{feature.title}}</div></div>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope, element, attrs) {
                scope.contextfeatures = [];

                scope.$watch("pos", function () {
                    element[0].style.left = scope.pos.left + "px";
                    element[0].style.top = scope.pos.top + "px";
                    scope.selectionText = "Selected " + scope.targets.length + " items";

                    scope.contextfeatures = ExtensionManager.getContextBindings(scope.targets[0].extension);
                }, true);

                element.bind('click', function (e) {
                    e.stopPropagation();
                });
            },
            scope: {
                targets: "=",
                pos: "="
            }
        };
    });
