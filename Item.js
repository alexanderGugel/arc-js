function Item (key, value) {
  this.next = null
  this.prev = null
  this.list = null

  this.key = key
  this.value = value
}

Item.prototype.remove = function () {
  if (!this.list) return
  this.list.count--

  if (this.prev) {
    this.prev.next = this.next
  }

  if (this.next) {
    this.next.prev = this.prev
  }

  if (this.list.first === this) {
    this.list.first = this.next
  }

  if (this.list.last === this) {
    this.list.last = this.prev
  }

  this.prev = null
  this.list = null
}

Item.prototype.appendTo = function (list) {
  this.remove()

  if (list.last) {
    this.prev = list.last
    this.prev.next = this
  }

  this.list = list
  this.list.count++

  list.last = this
  list.first = list.first || this
}

Item.prototype.prependTo = function (list) {
  this.remove()

  if (list.first) {
    this.next = list.first
    this.next.prev = this
  }

  this.list = list
  this.list.count++

  list.first = this
  list.last = list.last || this
}

module.exports = Item
