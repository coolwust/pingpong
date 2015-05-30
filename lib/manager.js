'use strict';

var EventEmitter = require('events').EventEmitter;

function MiddlewareManager(socket) {
  this.inbounds = [];
  this.outbounds = [];
  this.socket = socket;
  socket.on('message', function (message) {
    var payload = { message: message };
    this.receive(payload);
  }.bind(this));
}

function use(domain, middleware) {
  if (domain === 'inbound') {
    this.inbounds.push(middleware);
  } else {
    this.outbounds.unshift(middleware);
  }
}

function receive(payload) {
  this.exec('inbound', payload, function () {
    this.send(payload);
  }.bind(this));
}

function send(payload) {
  this.exec('outbound', payload, function () {
      this.socket.send(payload.message);
      this.emit('send');
  }.bind(this));
}

function exec(domain, payload, done) {
  if (domain === 'inbound') {
    var middlewares = this.inbounds;
  } else {
    var middlewares = this.outbounds;
  }
  var i = 0;
  var self = this;
  function iteration() {
    if (i === middlewares.length) {
      return done && done();
    }
    middlewares[i].call(self, payload, function () {
      i++;
      iteration();
    });
  }
  iteration();
}

var properties = {
  constructor: {
    value: MiddlewareManager,
    writable: true,
    configurable: true,
    enumerable: false
  }
};

MiddlewareManager.prototype = Object.create(EventEmitter.prototype, properties);
MiddlewareManager.prototype.receive = receive;
MiddlewareManager.prototype.send = send;
MiddlewareManager.prototype.exec = exec;
MiddlewareManager.prototype.use = use;
module.exports = MiddlewareManager;
