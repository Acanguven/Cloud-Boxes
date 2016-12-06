'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:SidebarCtrl
 * @description
 * # SidebarCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('SidebarCtrl', function ($scope, SidebarManager, $element, Windowmanager, ExtensionManager, $timeout) {
        $scope.activeWindow = "";
        $scope.SidebarManager = SidebarManager;
        $scope.runningWindows = Windowmanager.getRunningWindows();

        $timeout(function () {
            $scope.registeredExtensions = ExtensionManager.getSidebarApps();
        }, 1000);

        $scope.$watch(function () {
            return SidebarManager.getActiveWindow()
        }, function (n, o) {
            $scope.activeWindow = n;
            });

        $scope.clickSidebar = function (ext) {
            ext.onclick(ext._id);
        }
    });
