'use strict';

/**
 * @ngdoc function
 * @name CloudBoxes.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 * Controller of the CloudBoxes
 */
angular.module('CloudBoxes')
    .controller('LibraryCtrl', ['$http', '$scope', 'UserFactory', 'SidebarManager', '$rootScope', function ($http, $scope, UserFactory, SidebarManager, $rootScope) {
        $scope.selfId = UserFactory.getUserId()

        $scope.extensions = [];
        $scope.selectedExtension = null;
        $http.get("/api/extensions/").then(function (res) {
            $scope.extensions = res.data;
        });

        $scope.click = function (ext) {
            $scope.selectedExtension = ext;
        }

        $scope.createNew = function () {
            $http.post("/api/extensions/createNew").then(function (res) {
                $scope.extensions = res.data;
                console.log($scope.extensions);
            });
        }

        $scope.$watch("extensions", function () {
            for (var x = 0; x < $scope.extensions.length; x++) {
                $scope.extensions[x].isInstalled = UserFactory.isExtensionInstalled($scope.extensions[x]);
            }
        }, true);

        $scope.publish = function (ext, t) {
            $http.post("/api/extensions/publish", { extension: ext._id, t: t }).then(function (res) {
                $scope.extensions = res.data;
            });
        }

        $scope.edit = function (ext) {
            SidebarManager.setActiveWindow("editor");
            $rootScope.$broadcast("loadextension", { id: ext._id });
        }

        $scope.install = function (ext) {
            UserFactory.addExtension(angular.copy(ext));
            for (var x = 0; x < $scope.extensions.length; x++) {
                $scope.extensions[x].isInstalled = UserFactory.isExtensionInstalled($scope.extensions[x]);
            }
        }

        $scope.uninstall = function (ext) {
            UserFactory.removeExtension(angular.copy(ext));
            for (var x = 0; x < $scope.extensions.length; x++) {
                $scope.extensions[x].isInstalled = UserFactory.isExtensionInstalled($scope.extensions[x]);
            }
        }
    }]);
