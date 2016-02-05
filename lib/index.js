'use strict';

// level-iterator: decoding iterator for levelup instances
// TODO: wait for db.isOpen()

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function iterator(db, opts) {
  if (!iterator.available(db)) {
    throw new Error('level-iterator: no iterators available on db');
  }

  // If db exposes iterators, assume they do the decoding
  if (typeof db.iterator === 'function') {
    return db.iterator(opts);
  }

  // If it's a levelup instance, use its codec and iterate the *DOWN db
  var codec = db._codec;

  opts = codec.encodeLtgt(_extends({}, db.options, {
    keys: true,
    values: true,
    limit: -1
  }, opts || {}));

  opts.keyAsBuffer = codec.keyAsBuffer(opts);
  opts.valueAsBuffer = codec.valueAsBuffer(opts);

  var iter = db.db.iterator(opts);
  var wrapper = { end: iter.end.bind(iter) };

  wrapper.next = function (cb) {
    iter.next(function (err, key, value) {
      if (err) cb(err);else if (key === undefined && value === undefined) cb();else {
        key = opts.keys ? codec.decodeKey(key, opts) : null;
        value = opts.values ? codec.decodeValue(value, opts) : null;

        cb(null, key, value);
      }
    });
  };

  return wrapper;
}

iterator.available = function (db) {
  if (typeof db.iterator === 'function') return true;
  if (db._codec && db.db && typeof db.db.iterator === 'function') return true;
  return false;
};

module.exports = iterator;