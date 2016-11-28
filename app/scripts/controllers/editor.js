'use strict';

/**
 * @ngdoc function
 * @name CloudBoxes.controller:EditorCtrl
 * @description
 * # EditorCtrl
 * Controller of the CloudBoxes
 */
angular.module('CloudBoxes')
    .controller('EditorCtrl', function ($scope, $window, ExtensionManager) {
        $scope.codemirrorInstanceJs = CodeMirror(document.getElementsByClassName("editorInstanceJS")[0], {
            mode: "javascript",
            lineNumbers: true,
            theme: "dracula",
        });

        $scope.codemirrorInstanceHtml = CodeMirror(document.getElementsByClassName("editorInstanceHTML")[0], {
            mode: "html",
            lineNumbers: true,
            theme: "dracula",
        });

        $scope.codemirrorInstanceCss = CodeMirror(document.getElementsByClassName("editorInstanceCSS")[0], {
            mode: "css",
            lineNumbers: true,
            theme: "dracula",
        });

        angular.element($window).bind('resize', function () {
            var width = $window.innerHeight;
            $scope.$digest();
        });

        angular.element($window).bind("resize", function () {
            $scope.resizeMirror();
        })

        $scope.resizeMirror = function () {
            if (window.innerHeight > 900) {
                $(".instanceContainer").height(720);
            } else if (window.innerHeight > 730) {
                $(".instanceContainer").height(530);
            } else {
                $(".instanceContainer").height(window.innerHeight - 220);
            }
        }

        $scope.resizeMirror();

        $scope.extension = {
            html: "",
            css: "",
            js: "",
            name: "",
            category: "Misc",
            _id: makeid()
        }

        function makeid() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz";

            for (var i = 0; i < 8; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        $scope.try = function () {
            $scope.extension.html = $scope.codemirrorInstanceHtml.getValue();
            $scope.extension.css = $scope.codemirrorInstanceCss.getValue();
            $scope.extension.js = $scope.codemirrorInstanceJs.getValue();
            var evaledExtension = null;
            try {
                $scope.extension.js = eval($scope.extension.js);
                ExtensionManager.tryExtension($scope.extension);
            } catch (e) {
                alert(e);
            }  
        }

        $scope.saveDraft = function () {
            $scope.extension.html = $scope.codemirrorInstanceHtml.getValue();
            $scope.extension.css = $scope.codemirrorInstanceCss.getValue();
            $scope.extension.js = $scope.codemirrorInstanceJs.getValue();
            download(JSON.stringify($scope.extension), $scope.extension.name + ".acg", 'application/json');
        }

        function download(data, filename, type) {
            var a = document.createElement("a"),
                file = new Blob([data], { type: type });
            if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveOrOpenBlob(file, filename);
            else {
                var url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }

        $("#fileinput").change(function () {
            loadDraft(this.files[0])
        });

        function loadDraft(file) {

            // generate a new FileReader object
            var reader = new FileReader();

            // inject an image with the src url
            reader.onload = function (event) {
                var data = event.target.result;
                $scope.$apply(function () {
                    var parsedJson = JSON.parse(data);
                    $scope.extension.category = parsedJson.category;
                    $scope.extension._id = parsedJson._id;
                    $scope.extension.name = parsedJson.name;
                    $scope.extension.html = parsedJson.html;
                    $scope.extension.css = parsedJson.css;
                    $scope.extension.js = parsedJson.js;

                    $scope.codemirrorInstanceHtml.setValue($scope.extension.html);
                    $scope.codemirrorInstanceJs.setValue($scope.extension.js);
                    $scope.codemirrorInstanceCss.setValue($scope.extension.css);
                });
            }

            // when the file is read it triggers the onload event above.
            reader.readAsText(file);
        }

        $scope.loadDraft = function () {
            $("#fileinput").click();
        }
    });
