'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('LoginCtrl', function ($scope, UserFactory) {

        $scope.mode = false;

        $scope.tryLogin = function (username, password) {
            UserFactory.login(username, password);
        }

        $scope.tryRegister = function (username, password, passre, name) {
            if (password == passre) {
                UserFactory.register(username, password, name);
            }
        }

        $scope.swapMode = function () {
            $scope.mode = !$scope.mode;
        }
    });
