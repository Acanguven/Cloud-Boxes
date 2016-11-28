'use strict';

/**
 * @ngdoc overview
 * @name bireyselApp
 * @description
 * # bireyselApp
 *
 * Main module of the application.
 */

/*
    Preload SpeechLibrary
*/
(function () { "use strict"; var a; a = angular.module("angularWebSpeechDirective", []), a.service("jsSpeechFactory", ["$rootScope", function (a) { var b, c, d, e; return e = /\n\n/g, d = /\n/g, b = /\S/, c = { icons: { start: "http://goo.gl/2bfneP", recording: "http://goo.gl/p2jHO9", blocked: "http://goo.gl/vd4AKi" }, messages: { info_speak_now: 'Speak now... or <a href="#" ng-click="reset()">Cancel</a>', info_stop: "Proccessing your voice...", info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.', info_no_mic: "No microphone was found. Ensure that a microphone is installed.", info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.', info_denied: "Permission to use microphone was denied.", info_setup: "Click on the microphone icon to enable Web Speech.", info_upgrade: 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome" target="_blank">Chrome</a> version 25 or later.', info_allow: 'Click the "Allow" button above to enable your microphone.' }, linebreak: function (a) { return a.replace(e, "<p></p>").replace(d, "<br>") }, capitalize: function (a) { return a.replace(b, function (a) { return a.toUpperCase() }) } } }]), a.directive("jsSpeech", ["jsSpeechFactory", function (a) { return { restrict: "AE", replace: !0, transclude: !0, require: "^ngModel", scope: { ngModel: "=" }, template: '<div class="jsSpeechFactory-container">\n<a href="" class="jsSpeechFactory-btn" ng-click="toggleStartStop()">\n\n  <i class="fa fa-microphone fa-2x" ng-hide="ngModel.recognizing"></i>\n  <i class="fa fa-microphone-slash fa-2x" ng-show="ngModel.recognizing"></i>\n\n</a>\n<input type="text" class="form-control" ng-model="ngModel.value"/>\n<p class="text-muted jsSpeechFactory-hint" ng-bind-html-unsafe="speech.msg"></p>\n</div>', link: function (b, c, d, e) { var f, g, h, i, j, k, l, m, n, o, p; return f = b, k = !1, j = null, f.speech = { msg: a.messages.info_setup, icon: a.icons.start, recognizing: !1 }, b.$watch("ngModel", function (a, b) { return console.log(a) }, !0), m = function (a) { var c; return c = b.$root.$$phase, "$apply" !== c && "$digest" !== c ? b.$apply(a) : a && "function" == typeof a ? a() : void 0 }, o = function (b) { return m(function () { return f.speech.msg = a.messages[b] }) }, n = function (b) { return m(function () { return f.speech.icon = a.icons[b] }) }, g = function () { return l(), "webkitSpeechRecognition" in window ? (j = new webkitSpeechRecognition, j.continuous = !0, j.interimResults = !0, j.onerror = onerror, j.onend = l, j.onresult = h, j.onstart = i) : (j = {}, p()) }, p = function () { return o("info_upgrade"), n("blocked") }, i = function (a) { var b; return f.ngModel.recognizing = !0, n("recording"), o("info_speak_now"), console.log("onstart", a), b = function (a, b) { switch (console.log("onerror", a, b), f.ngModel.recognizing = !1, a.error) { case "not-allowed": return o("info_blocked"); case "no-speech": return o("info_no_speech"); case "service-not-allowed": return o("info_denied"); default: return console.log(a) } } }, h = function (b) { var c, d, e, g, h; for (n("recording"), o("info_speak_now"), e = b.resultIndex, g = "", c = e, h = []; c < b.results.length;)d = b.results[c][0], g = a.capitalize(d.transcript), m(function () { return f.ngModel.interimResults = g, f.ngModel.value = g, f.ngModel.recognizing = !0 }), b.results[c].isFinal && m(function () { return f.ngModel.value = g, f.ngModel.recognizing = !1 }), h.push(++c); return h }, l = function (a) { return console.log("reset", a), f.ngModel.recognizing = !1, n("start"), o("info_setup"), f.abort = function () { return f.toggleStartStop() } }, f.toggleStartStop = function () { return f.ngModel.recognizing ? (j.stop(), l()) : (j.start(), f.ngModel.recognizing = !0, n("blocked")) }, g() } } }]) }).call(this);
var providers = {};
angular
    .module('CloudBoxes', [
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ngTouch',
        'angularWebSpeechDirective'
    ], function ($controllerProvider, $compileProvider, $provide) {
        providers = {
            $controllerProvider: $controllerProvider,
            $compileProvider: $compileProvider,
            $provide: $provide
        };
    });
