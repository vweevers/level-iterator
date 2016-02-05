const iterator = require('./')
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
