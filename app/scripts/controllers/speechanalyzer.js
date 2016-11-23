'use strict';

/**
 * @ngdoc function
 * @name bireyselApp.controller:SpeechanalyzerCtrl
 * @description
 * # SpeechanalyzerCtrl
 * Controller of the bireyselApp
 */
angular.module('CloudBoxes')
    .controller('SpeechanalyzerCtrl', function ($scope,$interval) {
        $scope.recognizing = false;
        $scope.lastUpdate = Date.now();
        $scope.validSearch = false;
        $scope.recognition = new webkitSpeechRecognition();
        $scope.recognition.continuous = true;
        $scope.recognition.interimResults = true;

        $scope.reset = function (event) {
            $scope.recognizing = false;
        }

        $scope.onresult = function (event) {
            $scope.validSearch = false;
            $scope.recognizing = true;
            $scope.lastUpdate = Date.now();
            var resultIndex = event.resultIndex;
            var i = resultIndex;
            while (i < event.results.length) {
                var result = event.results[i][0]
                var trans = result.transcript
                $scope.$apply(function () {
                    $scope.searchtext = trans;
                });
                if (event.results[i].isFinal) {
                    $scope.searchtext = trans;
                }
                ++i;
            }
        }

        $scope.onerror = function (event, message) {
            console.log('onerror', event, message);
        }

        $scope.onstart = function (event) {
            
        }

        $interval(function () {
            if ($scope.recognizing) {
                if (Date.now() - $scope.lastUpdate > 2000) {
                    $scope.recognizing = false;
                    $scope.searchValidation();
                }
            }
        }, 500);

        var regexList = [
            {
                regex: /(search) for ((?!\s).)/gi,
                action: function (foundarr) {
                    if (foundarr.length == 5) {

                    }
                }
            },
            {
                regex: /(google) for ((?!\s).)/gi,
                action: function (foundarr) {
                    if (foundarr.length == 5) {

                    }
                }
            },            
        ]

        $scope.searchValidation = function () {
            var searchInput = $scope.searchtext;
            for (var x = 0; x < regexList.length; x++) {
                var m;
                while ((m = regexList[x].regex.exec(searchInput)) !== null) {
                    if (m.index === regexList[x].regex.lastIndex) {
                        regexList[x].regex.lastIndex++;
                    }

                    $scope.validSearch = true;

                    regexList[x].action(m);
                }
            }
        }


        $scope.recognition.onerror = $scope.onerror;
        $scope.recognition.onend = $scope.reset;
        $scope.recognition.onresult = $scope.onresult;
        $scope.recognition.onstart = $scope.onstart;

        $scope.recognition.start();

        $scope.$on("$destroy", function () {
            $scope.recognition.stop();
        });
    });
