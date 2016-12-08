'use strict';

/**
 * @ngdoc function
 * @name CloudBoxes.controller:TopbarCtrl
 * @description
 * # TopbarCtrl
 * Controller of the CloudBoxes
 */
angular.module('CloudBoxes')
    .controller('TopbarCtrl', ['$scope', 'SidebarManager', '$element', function ($scope, SidebarManager, $element) {
        $scope.activeWindow = "";
        $scope.SidebarManager = SidebarManager;

        $scope.$watch(function () {
            return SidebarManager.getActiveWindow()
        }, function (n, o) {
            $scope.activeWindow = n;
        });

        $scope.toggleFullScreen = function () {
            var elem = document.getElementById("overlay");
            // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
                if (elem.requestFullScreen) {
                    elem.requestFullScreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullScreen) {
                    elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
    }]);
