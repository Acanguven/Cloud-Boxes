'use strict';

/**
 * @ngdoc service
 * @name bireyselApp.StorageLibrary
 * @description
 * # StorageLibrary
 * Factory in the bireyselApp.
 */
angular.module('CloudBoxes')
  .factory('StorageLibrary', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
