'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:BoxesCtrl
 * @description
 * # BoxesCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('BoxesCtrl', ['$rootScope', '$scope', 'StorageLibrary', '$element', '$interval', '$timeout', '$compile',function ($rootScope, $scope, StorageLibrary, $element, $interval, $timeout, $compile) {
        StorageLibrary.getDesktopItems(function (list) {
            $scope.desktopItems = list;
        });
        $scope.path = "/";
        $scope.rectangleflag = false;
        $scope.contextVisible = false;


        $scope.click = function () {
            if ($scope.rectangleflag) {
                $scope.rectangleflag = false;
            } else {
                $scope.$broadcast('unselect');
                $scope.contextVisible = false;
            }
        }

        $scope.deskTopElement = document.getElementById("deskTopElement");
        angular.element(document).ready(function () {
            $scope.targetOffset = getOffset($scope.deskTopElement);
        });

        function getOffset(el) {
            var _x = 0;
            var _y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return { top: _y, left: _x };
        }

        $scope.contextmenu = function (e) {
            $scope.selectedObjects = $scope.desktopItems.filter(function (obj) {
                return obj.selected;
            });
            $scope.contextpos = {
                left: e.pageX - $scope.targetOffset.left,
                top: e.pageY - $scope.targetOffset.top
            }
            $scope.contextVisible = true;
            e.preventDefault();
        }

        $element.bind("contextmenu", $scope.contextmenu);
        $element.bind("click", $scope.click);

        $scope.$on('clickonbox', function (event, target) {
            $scope.contextVisible = false;
        });


        $rootScope.$on('createWindow', function (event, params) {
            $element.injector().invoke(function ($compile, $rootScope) {
                var newScope = $scope.$new(true);
                newScope.args = params.args;
                $element.append($compile("<" + "d" + params.id + ">" + "</" + "d" + params.id + ">")(newScope));
            });
        });
    }]);
