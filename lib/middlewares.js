'use strict';

function decode(payload, next) {
  if (!payload.message) {
    return setImmediate(next);
  }
  var encoded = payload.message.toString();
  var buffer = new Buffer(encoded, 'base64');
  var decoded = buffer.toString('utf8');
  var p = { message: decoded };
  encode(p, function () {
    if (p.message !== encoded) {
      payload.err = new Error('invalid base64 input');
      payload.err.code = 64;
    } else {
      payload.message = decoded;
    }
    next();
  });
}

function encode(payload, next) {
  if (!payload.message) {
    return setImmediate(next);
  }
  var buffer = new Buffer(payload.message);
  payload.message = buffer.toString('base64');
  setImmediate(next);
}

exports.decode = decode;
exports.encode = encode;
