'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.user
 * @description
 * # user
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('UserFactory', function ($http) {
        var user = null;

        
        return {
            userLoggedIn: function () {
                return user !== null;
            },
            setUser: function (i) {
                user = i;
            },
            login: function (username, password) {
                $http.post("/api/user/login", { username: username, password: password }).then(function (res) {
                    if (res.data.token) {
                        user = res.data;
                    }
                });
            }
        };
    });
