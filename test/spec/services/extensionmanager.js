'use strict';

describe('Service: extensionManager', function () {

  // load the service's module
  beforeEach(module('CloudBoxes'));

  // instantiate service
  var extensionManager;
  beforeEach(inject(function (_extensionManager_) {
    extensionManager = _extensionManager_;
  }));

  it('should do something', function () {
    expect(!!extensionManager).toBe(true);
  });

});
