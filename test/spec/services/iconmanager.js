'use strict';

describe('Service: iconmanager', function () {

  // load the service's module
  beforeEach(module('CloudBoxes'));

  // instantiate service
  var iconmanager;
  beforeEach(inject(function (_iconmanager_) {
    iconmanager = _iconmanager_;
  }));

  it('should do something', function () {
    expect(!!iconmanager).toBe(true);
  });

});
