![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
[![Build Status](https://travis-ci.org/alexanderGugel/arc-js.svg?branch=master)](https://travis-ci.org/alexanderGugel/arc-js)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

arc-js
======

An [Adaptive Replacement Cache (ARC)](http://web.archive.org/web/20150405221102/https://www.usenix.org/legacy/event/fast03/tech/full_papers/megiddo/megiddo.pdf) written in JavaScript.

Looking for the Go version? [alexanderGugel/arc](https://github.com/alexanderGugel/arc)

Overview
--------

This project implements "ARC", a self-tuning, low overhead replacement cache. The goal of this project is to follow the algorithm outlined in the linked research paper as closely as possible. ARC uses a learning rule to adaptively and continually revise its assumptions about the workload in order to adjust the internal LRU and LFU cache sizes.

This implementation is based on Nimrod Megiddo and Dharmendra S. Modha's ["ARC: A SELF-TUNING, LOW OVERHEAD REPLACEMENT CACHE"](http://web.archive.org/web/20150405221102/https://www.usenix.org/legacy/event/fast03/tech/full_papers/megiddo/megiddo.pdf), while definitely useable, this is still an experiment and shouldn't be considered production-ready.

```
<------- cache size c ------>
+-----------------+----------
| LFU             | LRU     |
+-----------------+----------
                  ^
                  |
                  p (dynamically adjusted by learning rule)

B1 [...]
B2 [...]
```

The cache is implemented using two internal caching systems L1 and L2. The cache size c defines the maximum number of entries stored (excluding ghost entries). Ghost entries are being stored in two "ghost registries" B1 and B1. Ghost entries no longer have a value associated with them.

Ghost entries are being used in order to keep track of expelled pages. They no longer have a value associated with them, but can be promoted into the internal LRU cache.

Frequently requested pages are being promoted into the LFU.

Usage
-----

```js

var mainStorage = {
  get: function (key) {
    // User specific logic (FS/ DB interaction)
    return value
  }
}

// c = 10: Cache size
// mainStorage = slow storage medium
var arc = new ARC(10, mainStorage)

// Retrieves my_key from cache (uses the mainStorage if item is not cached)
var value = arc.request('my_key')
```

TODO
----

- [ ] More tests (remove randomized tests)
- [ ] Careful code review
- [ ] Review API

License
-------

See `LICENSE` file.
