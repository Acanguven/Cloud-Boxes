'use strict';

describe('Service: sidebarManager', function () {

  // load the service's module
  beforeEach(module('bireyselApp'));

  // instantiate service
  var sidebarManager;
  beforeEach(inject(function (_sidebarManager_) {
    sidebarManager = _sidebarManager_;
  }));

  it('should do something', function () {
    expect(!!sidebarManager).toBe(true);
  });

});
