# level-iterator

**Decoding iterator for levelup instances. Wraps *DOWN iterators like `level-iterator-stream` does. For when you want speed and can do without backpressure and other stream features.**

[![npm status](http://img.shields.io/npm/v/level-iterator.svg?style=flat-square)](https://www.npmjs.org/package/level-iterator) [![Travis build status](https://img.shields.io/travis/vweevers/level-iterator.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/level-iterator) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/level-iterator.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/level-iterator) [![Dependency status](https://img.shields.io/david/vweevers/level-iterator.svg?style=flat-square)](https://david-dm.org/vweevers/level-iterator)

## example

```js
const iterator = require('level-iterator')
const disk = require('test-level')({ clean: true, encoding: 'json' })

const db = disk()

db.batch([
  { key: 1, value: 1 },
  { key: 2, value: 2 },
  { key: 3, value: 3 }
], function(err) {
  // Bypass value decoding
  const iter = iterator(db, { gt: 2, values: false })

  iter.next(function(err, key, value){
    console.log(typeof key, key === 3, value) // number true null

    // Don't forget to call end()
    iter.end(function(){
      console.log('done')
    })
  })
})
```

## `iterator(db[,opts])`

- `db` must be a levelup db
- `opts` is all the usual stuff (keys, values, limit, ltgt, encoding, ..)

## install

With [npm](https://npmjs.org) do:

```
npm install level-iterator
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
