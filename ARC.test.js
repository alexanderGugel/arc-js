var test = require('tape')
var ARC = require('./ARC')

var storage = {}

for (var i = 0; i < 100; i++) {
  storage['key: ' + i] = 'value: ' + i
}

var mainStorage = (function (storage) {
  return {
    get: function (key) {
      return storage[key]
    }
  }
})(storage)

test('ARC#request', function (t) {
  var arc = new ARC(3, mainStorage)

  t.equal(arc.request('key: ' + 1), 'value: ' + 1)

  var keys = Object.keys(storage)

  // Probalisitic test
  for (var i = 0; i < 100; i++) {
    var key = keys[~~(Math.random() * keys.length)]
    t.equal(arc.request(key), storage[key])
  }

  t.end()
})
