'use strict';

// level-iterator: decoding iterator for levelup instances
// TODO: wait for db.isOpen()
function iterator(db, opts) {
  if (!iterator.available(db)) {
    throw new Error('level-iterator: no iterators available on db')
  }

  // If db exposes iterators, assume they do the decoding
  if (typeof db.iterator === 'function') {
    return db.iterator(opts)
  }

  // If it's a levelup instance, use its codec and iterate the *DOWN db
  const codec = db._codec

  opts = codec.encodeLtgt({
    ...db.options,
    keys: true,
    values: true,
    limit: -1,
    ...( opts || {} )
  })

  opts.keyAsBuffer   = codec.keyAsBuffer(opts)
  opts.valueAsBuffer = codec.valueAsBuffer(opts)

  const iter = db.db.iterator(opts)
  const wrapper = { end: iter.end.bind(iter) }

  wrapper.next = function(cb) {
    iter.next(function(err, key, value){
      if (err) cb(err)
      else if (key === undefined && value === undefined) cb()
      else {
        key = opts.keys ? codec.decodeKey(key, opts) : null
        value = opts.values ? codec.decodeValue(value, opts) : null

        cb(null, key, value)
      }
    })
  }

  return wrapper
}

iterator.available = function(db) {
  if (typeof db.iterator === 'function') return true
  if (db._codec && db.db && typeof db.db.iterator === 'function') return true
  return false
}

module.exports = iterator
