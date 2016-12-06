'use strict';

/**
 * @ngdoc service
 * @name CloudBoxes.cssmanager
 * @description
 * # cssmanager
 * Factory in the CloudBoxes.
 */
angular.module('CloudBoxes')
    .factory('Cssmanager', function () {
        var installedCSS = [];

        function updateCSS(name, data) {

            var existed = document.getElementById("extensioncss-" + name);
            if (existed) {
                existed.remove();
            }
            var css = data,
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            style.type = 'text/css';
            style.id = "extensioncss-" + name;
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }

        function removeCSS(name, data) {
            var existed = document.getElementById("extensioncss-" + name);
            if (existed) {
                existed.remove();
            }
        }

        return {
            addUpdateCss: function (name, data) {
                updateCSS(name, data);
            },
            removeCss: function (name) {
                return meaningOfLife;
            }
        };

    });
