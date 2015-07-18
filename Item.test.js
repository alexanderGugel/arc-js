var test = require('tape')
var List = require('./List')
var Item = require('./Item')

test('Item#appendTo', function (t) {
  var list = new List()

  var a = new Item('a-key', { a: 'value' })
  var b = new Item('b-key', { b: 'value' })
  var c = new Item('c-key', { c: 'value' })

  a.appendTo(list)

  t.equal(list.first, a)
  t.equal(list.last, a)

  t.equal(a.prev, null)
  t.equal(a.next, null)

  b.appendTo(list)

  t.equal(list.last, b)
  t.equal(list.first, a)

  t.equal(a.next, b)
  t.equal(a.prev, null)

  t.equal(b.prev, a)
  t.equal(b.next, null)

  c.appendTo(list)

  t.equal(list.last, c)
  t.equal(list.first, a)

  t.end()
})
