'use strict';

describe('Directive: selectorrect', function () {

  // load the directive's module
  beforeEach(module('CloudBoxes'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<selectorrect></selectorrect>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the selectorrect directive');
  }));
});
