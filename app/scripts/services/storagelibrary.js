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
            renamePath: function (oldPath, newPath) {

            },
            readFileAs64: function (path, cb) {
                $http.post("/api/fs/readEncoded", { filepath: path }).then(function (res) {
                    cb(res.data);
                });
            },
            readFileAsText: function (path, format, cb) {
                $http.post("/api/fs/readText", { filepath: path, format: format }).then(function (res) {
                    cb(res.data);
                });
            },
            saveFileAsText: function (data, path, format, cb) {
                $http.post("/api/fs/saveText", { filepath: path, format: format, data: data }).then(function (res) {
                    cb();
                });
            },
            createFile: function (path, cb) {
                $http.post("/api/fs/saveText", { filepath: path, format: format, data: data }).then(function (res) {
                    cb();
                });
            }
        };
    });
