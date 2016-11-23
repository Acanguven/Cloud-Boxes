'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('MainCtrl', function ($scope, UserFactory, SidebarManager) {
        $scope.UserFactory = UserFactory;
        $scope.SidebarManager = SidebarManager;

        $scope.activeWindow = "";
        $scope.$watch(function () {
            return SidebarManager.getActiveWindow()
        }, function (n, o) {
            $scope.activeWindow = n;
        });
    });
