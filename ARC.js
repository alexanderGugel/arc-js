var List = require('./List')
var Item = require('./Item')

function ARC (c, mainStorage) {
  if (!(this instanceof ARC)) return new ARC(c, mainStorage)
  this.c = c
  this.p = 0
  this.mainStorage = mainStorage
  this.t1 = new List()
  this.b1 = new List()
  this.t2 = new List()
  this.b2 = new List()
  this.keyToItem = {}
}

ARC.prototype.request = function (key) {

  var item = this.keyToItem[key]

  if (!item) {
    item = new Item(key, null)
    this.keyToItem[key] = item
  }

  var delta

  switch (item.list) {
    case this.t1:
    case this.t2:
      // Case I
      item.prependTo(this.t2)
      break
    case this.b1:
      // Case II
      delta = this.b1.count >= this.b2.count ? 1 : this.b2.count / this.b1.count
      this.p = Math.min(
        this.p + delta,
        this.c
      )
      item.value = this.mainStorage.get(key)
      this._replace(item)
      item.prependTo(this.t2)
      break
    case this.b2:
      // Case III
      delta = this.b2.count >= this.b1.count ? 1 : this.b1.count / this.b2.count
      this.p = Math.max(
        this.p - delta,
        0
      )
      item.value = this.mainStorage.get(key)
      this._replace(item)
      item.prependTo(this.t2)
      break
    default:
      // Case IV: Cache miss
      if (this.c === this.t1.count + this.b1.count) {
        // Case A
        if (this.t1.count < this.c) {
          if (this.b1.last) {
            delete this.keyToItem[this.b1.last.key]
            this.b1.last.remove()
          }
          this._replace(item)
        } else {
          if (this.t1.last) {
            delete this.keyToItem[this.t1.last.key]
            this.t1.last.remove()
          }
        }
      } else {
        // Case B
        if (this.t1.count + this.t2.count + this.b1.count + this.b2.count >= this.c) {
          if (this.t1.count + this.t2.count + this.b1.count + this.b2.count === 2 * this.c) {
            if (this.b2.last) {
              delete this.keyToItem[this.b2.last.key]
              this.b2.last.remove()
            }
          }
          this._replace(item)
        }
      }
      item.value = this.mainStorage.get(key)
      item.prependTo(this.t1)
  }

  return item.value
}

ARC.prototype._replace = function (item) {
  if (
    this.t1.count > 0 &&
    (
      (this.t1.count > this.p) ||
      (item.list === this.b2 && this.t1.count === this.p)
    )
  ) {
    this.t1.last.value = null
    this.t1.last.prependTo(this.b1)
  } else {
    this.t2.last.value = null
    this.t2.last.prependTo(this.b2)
  }
}

module.exports = ARC
