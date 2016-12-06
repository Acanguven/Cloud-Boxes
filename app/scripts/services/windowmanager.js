'use strict';

/**
 * @ngdoc service
 * @name CloudBoxes.windowmanager
 * @description
 * # windowmanager
 * Factory in the CloudBoxes.
 */
angular.module('CloudBoxes')
    .factory('Windowmanager', function () {
        var runningWindows = [];

        // Public API here
        return {
            registerWindow: function ($scope) {
                runningWindows.push($scope);
                return { left: 200 + (20 * (runningWindows.length - 1)), top: 50 + (20 * (runningWindows.length - 1)),};
            },
            destroyWindow: function ($scope) {
                var i = -1;
                for (var x = 0; x < runningWindows.length; x++) {
                    if (runningWindows[x].$id === $scope.$id) {
                        i = x;
                    }
                }
                if (i != -1) {
                    runningWindows.splice(i, 1);
                }
            },
            getRunningWindows: function () {
                return runningWindows;
            }
        };
    });
