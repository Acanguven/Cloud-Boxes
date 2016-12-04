'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.StorageLibrary
 * @description
 * # StorageLibrary
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('StorageLibrary', function ($http) {



        return {
            getDesktopItems: function (cb) {
                $http.post("/api/fs/getPathFolders", { folderpath: "/" }).then(function (res) {
                    cb(res.data);
                });
            },
            getPathItems: function (path, cb) {
                $http.post("/api/fs/getPathFolders", { folderpath: path }).then(function (res) {
                    cb(res.data);
                });
            },
            createFolder: function (path, name) {

            },
            createFile: function (path, name) {

            },
        };
    });
