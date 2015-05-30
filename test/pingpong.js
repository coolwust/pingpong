'use strict';

var assert = require('assert');
var child_process = require('child_process');

describe('server and client', function () {
  var server;
  var client;
  beforeEach(function (done) {
    server = child_process.fork(__dirname + '/../lib/server.js');
    client = child_process.fork(__dirname + '/../lib/client.js');
    done();
  });
  afterEach(function (done) {
    server.kill('SIGINT');
    client.kill('SIGINT');
    done();
  });
  it('ping and pong', function (done) {
    client.send('hello');
    client.on('message', function (message) {
      assert.equal(message, 'hello!');
      done();
    });
  });
});
