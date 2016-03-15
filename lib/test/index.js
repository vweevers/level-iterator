'use strict';

var test = require('tape'),
    iterator = require('../'),
    iota = require('iota-array'),
    level = require('test-level')({
  clean: true,
  keyEncoding: 'json',
  valueEncoding: 'json'
});

test('basic', function (t) {
  t.plan(5);

  var db = level();

  db.batch(iota(6).map(function (n) {
    return { key: n, value: { n: n } };
  }), function (err) {
    t.ifError(err, 'no batch error');

    var iter = iterator(db, { gt: 1 });

    iter.next(function innerNext(err, key, value) {
      t.ifError(err, 'no next error');

      t.is(key, 2, 'key decoded');
      t.same(value, { n: 2 }, 'value decoded');

      iter.end(function innerEnd(err) {
        t.ifError(err, 'no end error');
      });
    });
  });
});