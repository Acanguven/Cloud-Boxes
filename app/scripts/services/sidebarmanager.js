'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.sidebarManager
 * @description
 * # sidebarManager
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('SidebarManager', function () {
        var activeWindow = "boxes";

        return {
            getActiveWindow: function () {
                return activeWindow;
            },
            setActiveWindow: function (w) {
                activeWindow = w;
            },
        }
    });
