'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:SidebarCtrl
 * @description
 * # SidebarCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('SidebarCtrl', function ($scope, SidebarManager, $element, Windowmanager) {
        $scope.activeWindow = "";
        $scope.SidebarManager = SidebarManager;
        $scope.runningWindows = Windowmanager.getRunningWindows();

        $scope.$watch(function () {
            return SidebarManager.getActiveWindow()
        }, function (n, o) {
            $scope.activeWindow = n;
        });
    });
