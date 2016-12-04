'use strict';

describe('Service: cssmanager', function () {

  // load the service's module
  beforeEach(module('CloudBoxes'));

  // instantiate service
  var cssmanager;
  beforeEach(inject(function (_cssmanager_) {
    cssmanager = _cssmanager_;
  }));

  it('should do something', function () {
    expect(!!cssmanager).toBe(true);
  });

});
