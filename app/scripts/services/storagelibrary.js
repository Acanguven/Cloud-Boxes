'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.StorageLibrary
 * @description
 * # StorageLibrary
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('StorageLibrary', function () {

        return {
            getDesktopItems: function () {
                return [
                    {
                        extension: ".dir",
                        title: "A folder",
                        path: "/A\ folder",
                        position: {
                            refWidth: 1870,
                            refHeight: 1000,
                            x: 300,
                            y: 300
                        }
                    },
                    {
                        extension: ".dir",
                        title: "Programlar",
                        path: "/Programlar",
                        position: {
                            refWidth: 1870,
                            refHeight: 1000,
                            x: 300,
                            y: 300
                        }
                    },
                ];
            }
        };
    });
