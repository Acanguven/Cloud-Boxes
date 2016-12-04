'use strict';

describe('Service: windowmanager', function () {

  // load the service's module
  beforeEach(module('CloudBoxes'));

  // instantiate service
  var windowmanager;
  beforeEach(inject(function (_windowmanager_) {
    windowmanager = _windowmanager_;
  }));

  it('should do something', function () {
    expect(!!windowmanager).toBe(true);
  });

});
