'use strict';

var MiddlewareManager = require('../lib/manager.js');
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');

describe('MiddlewareManager', function () {

  function PseudoSocket() {
  }

  function send(message) {
    result = message;
  }

  var properties = {
    constructor: {
      value: PseudoSocket,
      writable: true,
      configurable: true,
      enumerable: false
    }
  };

  PseudoSocket.prototype = Object.create(EventEmitter.prototype, properties);
  PseudoSocket.prototype.send = send;

  var socket;
  var manager;
  var result;
  beforeEach(function () {
    socket = new PseudoSocket();
    manager = new MiddlewareManager(socket);
  });

  it('message should be configured by middlewares', function (done) {
    manager.use('inbound', function (payload, next) {
      var message = payload.message;
      payload.message = message.charAt(0).toUpperCase() + message.slice(1);
      setImmediate(next);
    });
    manager.use('outbound', function (payload, next) {
      var message = payload.message;
      payload.message = message + '!';
      setImmediate(next);
    });
    socket.emit('message', 'hello');
    manager.on('send', function () {
      assert.equal(result, 'Hello!');
      done();
    });
  });
});
