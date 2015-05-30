'use strict';

var zmq = require('zmq');
var MiddlewareManager = require('./manager.js');
var middlewares = require('./middlewares.js');

var reply = zmq.createSocket('rep');
var manager = new MiddlewareManager(reply);
manager.use('inbound', middlewares.decode);
manager.use('outbound', middlewares.encode);
manager.use('inbound', function (payload, next) {
  if (payload.err) {
    payload.message = 'An error occured, please try again.'
  } else {
    payload.message = payload.message + '!';
  }
  setImmediate(next);
});
reply.bind('tcp://127.0.0.1:5555');
process.on('SIGINT', function () {
  reply.close();
});
