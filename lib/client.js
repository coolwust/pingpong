'use strict';

var zmq = require('zmq');
var MiddlewareManager = require('./manager.js');
var middlewares = require('./middlewares.js');

var request = zmq.createSocket('req');
var manager = new MiddlewareManager(request);
manager.use('inbound', middlewares.decode);
manager.use('outbound', middlewares.encode);
manager.use('inbound', function (payload, next) {
  process.send(payload.message);
  payload.message = null;
  setImmediate(next);
});
process.on('message', function (message) {
  manager.send({ message: message });
});
process.on('SIGINT', function () {
  request.close();
});

request.connect('tcp://127.0.0.1:5555');
