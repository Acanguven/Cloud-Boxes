'use strict';

describe('Service: StorageLibrary', function () {

  // load the service's module
  beforeEach(module('bireyselApp'));

  // instantiate service
  var StorageLibrary;
  beforeEach(inject(function (_StorageLibrary_) {
    StorageLibrary = _StorageLibrary_;
  }));

  it('should do something', function () {
    expect(!!StorageLibrary).toBe(true);
  });

});
