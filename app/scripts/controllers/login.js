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


        $scope.tryLogin = function (username, password) {
            UserFactory.login(username, password);
        }
    });
