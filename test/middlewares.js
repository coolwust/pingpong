'use strict';

var assert = require('assert');
var middlewares = require('../lib/middlewares.js');

describe('encode and decode', function () {
  it('encode', function (done) {
    var payload = { message: 'hello world' };
    middlewares.encode(payload, function () {
      assert.equal(payload.message, 'aGVsbG8gd29ybGQ=');
      done();
    });
  });
  it('decode', function (done) {
    var payload = { message: 'aGVsbG8gd29ybGQ=' };
    middlewares.decode(payload, function () {
      assert.equal(payload.message, 'hello world');
      done();
    });
  });
  it('decode with error', function(done) {
    var payload = { message: 'this is an invalid base64 string' };
    middlewares.decode(payload, function () {
      assert.equal(payload.err.code, 64);
      done();
    });
  });
});
