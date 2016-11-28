'use strict';

describe('Controller: SystemCtrl', function () {

  // load the controller's module
  beforeEach(module('CloudBoxes'));

  var SystemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemCtrl = $controller('SystemCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemCtrl.awesomeThings.length).toBe(3);
  });
});
