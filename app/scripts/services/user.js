'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.user
 * @description
 * # user
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('UserFactory', function () {
        var user = true; //make it null

        
        return {
            userLoggedIn: function () {
                return user !== null;
            },
            setUser: function (loggedInUser) {
                user = loggedInUser;
            }
        };
    });
