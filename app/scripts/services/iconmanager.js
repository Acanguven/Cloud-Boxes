'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.sidebarManager
 * @description
 * # sidebarManager
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('IconManager', function ($rootScope) {
        var icons = {};
        icons.__undefined = {
            type: "fa",
            data: "fa fa-file desktopFile"
        }

        return {
            addIcon: function (extension, type, data) {
                icons[extension] = {
                    type: type,
                    data: data
                }
                $rootScope.$broadcast('refreshIcon');
            },
            getIcon: function (extension) {
                if (icons[extension]) {
                    return icons[extension];
                } else {
                    return icons["__undefined"];
                }
            },
        }
    });
