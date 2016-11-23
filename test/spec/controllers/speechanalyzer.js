'use strict';

describe('Controller: SpeechanalyzerCtrl', function () {

  // load the controller's module
  beforeEach(module('bireyselApp'));

  var SpeechanalyzerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpeechanalyzerCtrl = $controller('SpeechanalyzerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpeechanalyzerCtrl.awesomeThings.length).toBe(3);
  });
});
