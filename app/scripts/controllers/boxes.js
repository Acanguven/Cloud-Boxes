'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:BoxesCtrl
 * @description
 * # BoxesCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('BoxesCtrl', function ($rootScope,$scope, StorageLibrary, $element, $interval, $timeout, $compile) {
        $scope.desktopItems = StorageLibrary.getDesktopItems();
        

        $scope.mdown = false;
        $scope.breakEvent = false;
        $scope.mouseDowned = false;
        $scope.contextVisible = false;
        $scope.selectorStarted = false;
        

        $scope.click = function () {
            if ($scope.selectorStarted) {
                $scope.selectorStarted = false;
                $scope.mdown = false;
            } else {
                $scope.$broadcast('unselect');
            }
            $scope.contextVisible = false;
        }

        $scope.$on('clickonbox', function (event, target) {
            $scope.contextVisible = false;
        });

        $scope.mousedown = function (e) {
            $scope.selectorRect.x = e.pageX;
            $scope.mouseDowned = true;
            $scope.breakEvent = false;
            $scope.selectorRect.y = e.pageY;
            $scope.selectorRect.startX = e.pageX;
            $scope.selectorRect.startY = e.pageY;
            
            $scope.selectorRect.width = 0;
            $scope.selectorRect.height = 0;
            
            $timeout(function () {
                if (!$scope.breakEvent) {
                    $scope.mdown = true;
                } else {
                    $scope.mdown = false;
                }
            },100);
        }

        $scope.mousemove = function (e) {
            if ($scope.mdown && $scope.mouseDowned) {
                $scope.selectorStarted = true;
                $scope.selectorRect.width = e.pageX - $scope.selectorRect.x;
                $scope.selectorRect.height = e.pageY - $scope.selectorRect.y;
                $scope.selectorRect.visible = true;
                if (e.pageY < $scope.selectorRect.startY) {
                    $scope.selectorRect.height = $scope.selectorRect.startY - e.pageY;
                    $scope.selectorRect.y = e.pageY;
                }

                if (e.pageX < $scope.selectorRect.startX) {
                    $scope.selectorRect.width = $scope.selectorRect.startX - e.pageX;
                    $scope.selectorRect.x = e.pageX;
                }
            }
        }

        $interval(function () {
            if ($scope.selectorRect.visible) {
                $(".selectorRect").css("width", $scope.selectorRect.width);
                $(".selectorRect").css("height", $scope.selectorRect.height);
                $(".selectorRect").css("left", $scope.selectorRect.x);
                $(".selectorRect").css("top", $scope.selectorRect.y);
            }
        },0);

        $scope.mouseup = function (e) {
            if ($scope.selectorStarted) {
                $scope.$broadcast('selectorRectangle', { x: $scope.selectorRect.x + 50, y: $scope.selectorRect.y, width: $scope.selectorRect.width, height: $scope.selectorRect.height });
            }
            $scope.selectorRect.visible = false;
            $scope.breakEvent = true;
            if ($scope.mouseDowned) {
                $scope.mouseDowned = false;
                $scope.breakEvent = false;
            }
            $scope.mdown = false;
        }

        $scope.selectorRect = {
            startX: 0,
            startY:0,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            visible: false
        }

        $scope.selectedObjects = [];
        $scope.contextpos = {
            left: 0,
            top: 0
        };

        $scope.contextmenu = function (e) {
            $scope.selectedObjects = $scope.desktopItems.filter(function (obj) {
                return obj.selected;
            });
            $scope.contextpos = {
                left: e.pageX,
                top: e.pageY
            }
            $scope.contextVisible = true;
            e.preventDefault();
        }

        $element.bind("contextmenu", $scope.contextmenu);
        $element.bind("click", $scope.click);
        $element.bind("mousedown", $scope.mousedown);
        $element.bind("mousemove", $scope.mousemove);
        $element.bind("mouseup", $scope.mouseup);





        $scope.extensionWindows = [];
        $rootScope.$on('createWindow', function (event, id) {
            var el = $compile("<" + id + ">"+"</"+ id + ">")($scope);
            $element.append(el);
        });
    });
