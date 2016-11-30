'use strict';

/**
 * @ngdoc directive
 * @name CloudBoxes.directive:bindhtmlcompile
 * @description
 * # bindhtmlcompile
 */
angular.module('CloudBoxes')
    .directive('bindhtmlcompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindhtmlcompile);
                }, function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
            }
        };
    }]);