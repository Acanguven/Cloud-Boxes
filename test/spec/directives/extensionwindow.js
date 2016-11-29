'use strict';

describe('Directive: extensionwindow', function () {

  // load the directive's module
  beforeEach(module('CloudBoxes'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<extensionwindow></extensionwindow>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the extensionwindow directive');
  }));
});
