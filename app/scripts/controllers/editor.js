'use strict';

/**
 * @ngdoc function
 * @name CloudBoxes.controller:EditorCtrl
 * @description
 * # EditorCtrl
 * Controller of the CloudBoxes
 */
angular.module('CloudBoxes')
    .controller('EditorCtrl', ['$scope', '$window', 'ExtensionManager', '$http', 'SidebarManager', '$rootScope', function ($scope, $window, ExtensionManager, $http, SidebarManager, $rootScope) {
        $scope.initName = "";

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
            _id: makeid(),
            newCreated: true
        }

        function makeid() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz";

            for (var i = 0; i < 15; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return "off" + text;
        }

        $scope.isOnlineData = function () {
            return $scope.extension._id.indexOf("off") != 0;
        }

        $scope.try = function () {
            $scope.extension.html = $scope.codemirrorInstanceHtml.getValue();
            $scope.extension.css = $scope.codemirrorInstanceCss.getValue();
            $scope.extension.js = $scope.codemirrorInstanceJs.getValue();
            var evaledExtension = null;
            try {
                $scope.extension.js = eval($scope.extension.js);
                ExtensionManager.tryExtension($scope.extension);
                SidebarManager.setActiveWindow("boxes");
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
                    $scope.extension.name = parsedJson.name;
                    $scope.extension.html = parsedJson.html;
                    $scope.extension.css = parsedJson.css;
                    $scope.extension.js = parsedJson.js;

                    $scope.codemirrorInstanceHtml.setValue($scope.extension.html);
                    $scope.codemirrorInstanceJs.setValue($scope.extension.js);
                    $scope.codemirrorInstanceCss.setValue($scope.extension.css);
                });
            }
            try {
                reader.readAsText(file);
            } catch (e) {

            }
        }

        $scope.loadDraft = function () {
            $("#fileinput").click();
        }

        $scope.loadExample = function () {
            $http.get("/scripts/tazdingo.acg").then(function (res) {
                $scope.extension.name = res.data.name;
                $scope.extension.html = res.data.html;
                $scope.extension.css = res.data.css;
                $scope.extension.js = res.data.js;

                $scope.codemirrorInstanceHtml.setValue($scope.extension.html);
                $scope.codemirrorInstanceJs.setValue($scope.extension.js);
                $scope.codemirrorInstanceCss.setValue($scope.extension.css);
            });
        }

        $rootScope.$on("loadextension", function (event, obj) {
            $http.get("/api/extensions/get/" + obj.id).then(function (res) {
                var ed = JSON.parse(res.data.data);
                $scope.extension._id = res.data._id;
                $scope.extension.name = res.data.name;
                $scope.extension.category = res.data.category;
                $scope.extension.html = ed.html;
                $scope.extension.css = ed.css;
                $scope.extension.js = ed.js;
                $scope.extension.newCreated = false;
                $scope.initName = angular.copy($scope.extension.name);

                $scope.codemirrorInstanceHtml.setValue($scope.extension.html);
                $scope.codemirrorInstanceJs.setValue($scope.extension.js);
                $scope.codemirrorInstanceCss.setValue($scope.extension.css);
            });
        });

        $scope.saveOnline = function () {
            if ($scope.extension.name.length == 0) {
                alert("Extension name ?");
                return;
            }
            $scope.extension.html = $scope.codemirrorInstanceHtml.getValue();
            $scope.extension.css = $scope.codemirrorInstanceCss.getValue();
            $scope.extension.js = $scope.codemirrorInstanceJs.getValue();

            if ($scope.extension.newCreated) {
                $http.post("/api/extensions/new", {
                    name: $scope.extension.name,
                    description: "A new extension!",
                    data: JSON.stringify({
                        js: $scope.extension.js,
                        css: $scope.extension.css,
                        html: $scope.extension.html
                    }),
                    category: $scope.extension.category,
                    live: false
                }).then(function (res) {
                    if (res.data.success) {
                        $scope.extension._id = res.data.id;
                    }
                });
            } else {
                $http.post("/api/extensions/edit/" + $scope.extension._id, {
                    name: $scope.extension.name,
                    description: "A new extension!",
                    data: JSON.stringify({
                        js: $scope.extension.js,
                        css: $scope.extension.css,
                        html: $scope.extension.html
                    }),
                    category: $scope.extension.category,
                    live: false
                });
            }
        }

        $scope.createNew = function () {
            $scope.extension = {
                html: "",
                css: "",
                js: "",
                name: "",
                category: "Misc",
                _id: makeid(),
                newCreated: true
            }
            $scope.codemirrorInstanceHtml.setValue($scope.extension.html);
            $scope.codemirrorInstanceJs.setValue($scope.extension.js);
            $scope.codemirrorInstanceCss.setValue($scope.extension.css);
        }
    }]);
