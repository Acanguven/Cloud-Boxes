'use strict';

describe('Controller: BoxesCtrl', function () {

  // load the controller's module
  beforeEach(module('bireyselApp'));

  var BoxesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoxesCtrl = $controller('BoxesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BoxesCtrl.awesomeThings.length).toBe(3);
  });
});
