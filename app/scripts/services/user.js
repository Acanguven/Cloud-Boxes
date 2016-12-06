'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.user
 * @description
 * # user
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
    .factory('UserFactory', function ($http, ExtensionManager) {
        var user = null;

        function updateExtensions() {
            ExtensionManager.updateExtensions(user.extensions);
        }

        return {
            getUserId: function () {
                return user._id;
            },
            userLoggedIn: function () {
                return user !== null;
            },
            setUser: function (i) {
                user = i;
                updateExtensions();
            },
            login: function (username, password) {
                $http.post("/api/user/login", { username: username, password: password }).then(function (res) {
                    if (res.data.token) {
                        user = res.data;
                        updateExtensions();
                    }
                });
            },
            addExtension: function (extension) {
                user.extensions.push(extension);
                $http.post("/api/user/updateExtensions", user.extensions);
                updateExtensions();
            },
            removeExtension: function (extension) {
                var i = -1;
                for (var x = 0; x < user.extensions.length; x++) {
                    if (user.extensions[x]._id == extension._id) {
                        i = x;
                    }
                }
                if (i != -1) {
                    user.extensions.splice(i, 1);
                }
                $http.post("/api/user/updateExtensions", user.extensions);
                updateExtensions();
            },
            isExtensionInstalled: function (extension) {
                for (var x = 0; x < user.extensions.length; x++) {
                    if (user.extensions[x]._id == extension._id) {
                        return true;
                    }
                }
                return false;
            },
            getExtensions: function () {
                return user.extensions;
            }
        };
    });
