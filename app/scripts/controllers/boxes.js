'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:BoxesCtrl
 * @description
 * # BoxesCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('BoxesCtrl', function ($scope, StorageLibrary) {
        $scope.desktopItems = StorageLibrary.getDesktopItems();
        $scope.click = function () {

        }
    });
