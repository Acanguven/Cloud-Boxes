'use strict';

/**
 * @ngdoc service
 * @name CloudBoxes.extensionManager
 * @description
 * # extensionManager
 * Factory in the CloudBoxes.
 */

angular.module('CloudBoxes')
    .factory('ExtensionManager', function ($rootScope) {
        var extensionList = {};
        var bindings = [];

        var setupExtension = function (extension) {
            var queueLen = angular.module('CloudBoxes')._invokeQueue.length;

            if (extension.js.window) {
                if (!extensionList[extension._id]) {
                    angular.module('CloudBoxes').directive(extension._id, function (ExtensionManager, $injector) {
                        return {
                            template: "<div class='extensionWindow' extensionwindow><div class='header'><i ng-if='window.fa && !window.img' class='fa' ng-class='window.fa'></i><img ng-if='window.img' ng-src='{{window.img}}'/><div class='title'>{{window.title}}</div><div class='options'><span><i class='fa fa-window-minimize' aria-hidden='true'></i></span><span><i class='fa fa-window-maximize' aria-hidden='true'></i><i class='fa fa-window-restore' aria-hidden='true'></i></span><span><i class='fa fa-times' aria-hidden='true'></i></span></div></div><div class='windowContent' ng-bind-html='template'></div></div>",
                            restrict: 'E',
                            replace: true,
                            link: function (scope, element, attrs) {
                                scope.template = ExtensionManager.getExtensionData(extension._id).html;
                                var scopeElement = angular.element(element[0].querySelector('.windowContent'))
                                scope.window = extension.js.window;
                                ExtensionManager.getExtensionData(extension._id).js(scope, scopeElement, attrs, $injector);
                            },
                            scope: ExtensionManager.getExtensionData(extension._id).scope
                        };
                    });

                    var queue = angular.module('CloudBoxes')._invokeQueue;
                    for (var i = queueLen; i < queue.length; i++) {
                        var call = queue[i];
                        var provider = providers[call[0]];
                        if (provider) {
                            provider[call[1]].apply(provider, call[2]);
                        }
                    }
                }

                extensionList[extension._id] = {
                    js: extension.js.controller,
                    css: extension.css,
                    html: extension.html,
                    scope: extension.js.scope
                }

                setBindings(extension);
            } else {
                setBindings(extension);
            }
        }

        function insertArrayAt(array, index, arrayToInsert) {
            Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
            return array;
        }

        var setBindings = function (extension) {
            clearBindings(extension._id);
            if (extension.js && extension.js.bind) {
                for (var prop in extension.js.bind) {
                    switch (prop) {
                        case "contextmenu":
                            if (extension.js.bind[prop] instanceof Array) {
                                for (var x = 0; x < extension.js.bind[prop].length; x++) {
                                    if (extension.js.bind[prop][x].extension && typeof extension.js.bind[prop][x].extension == 'string') {
                                        if (extension.js.bind[prop][x].title && typeof extension.js.bind[prop][x].title == 'string') {
                                            if (extension.js.bind[prop][x].action && typeof extension.js.bind[prop][x].action == 'function') {
                                                bindings.push({
                                                    type: "contextmenu",
                                                    extensionid: extension._id,
                                                    extension: extension.js.bind[prop][x].extension,
                                                    title: extension.js.bind[prop][x].title,
                                                    action: extension.js.bind[prop][x].action,
                                                    fa: extension.js.bind[prop][x].fa ? extension.js.bind[prop][x].fa : false,
                                                    img: extension.js.bind[prop][x].img ? extension.js.bind[prop][x].img : false
                                                });
                                            } else {
                                                console.error(extension.name, "Passed " + prop + "[" + x + "] doesnt have valid action, pass a function");
                                            }
                                        } else {
                                            console.error(extension.name, "Passed " + prop + "[" + x + "] doesnt have valid title");
                                        }
                                    } else {
                                        console.error(extension.name, "Passed " + prop + "[" + x + "] doesnt have valid extension type, you can use * for all");
                                    }
                                }
                            } else {
                                console.error(extension.name, "Passed bind property " + prop + " is not type of Array");
                            }
                            break;
                    }
                }
            }
        }

        var clearBindings = function (id) {
            bindings = bindings.filter(function (a) {
                return a.extensionid != id;
            });
        }

        this.createWindow = function (args) {
            $rootScope.$emit('createWindow', args.id);
        }

        var self = this;
        document.addEventListener("CBOutside", function (e) {
            if (self[e.detail.type]) {
                self[e.detail.type](e.detail.args);
            }
        });

        return {
            tryExtension: function (extension) {
                setupExtension(extension);
            },
            getContextBindings: function (extension) {
                return bindings.filter(function (binding) {
                    return binding.extension == extension;
                });
            },
            getExtensionData: function (id) {
                return extensionList[id];
            }
        }
    });


/*
    Public Api
*/

var CBOutside = function () {
    var fireEvent = function (type, args) {
        var event = new CustomEvent("CBOutside", { detail: { args: args, type: type } });
        document.dispatchEvent(event);
    }

    this.createWindow = function (id) {
        fireEvent("createWindow", { id: id });
    }
}

var CBapi = new CBOutside();