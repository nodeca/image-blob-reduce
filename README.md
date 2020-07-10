image-blob-reduce - downscale blobs with images inside
======================================================

[![Build Status](https://travis-ci.org/nodeca/image-blob-reduce.svg?branch=master)](https://travis-ci.org/nodeca/image-blob-reduce)
[![NPM version](https://img.shields.io/npm/v/image-blob-reduce.svg)](https://www.npmjs.org/package/image-blob-reduce)


> Wrapper for [pica](https://github.com/nodeca/pica) to work with blobs, with
> some sugar.

This is `pica` wrapper for convenient work with images from file input fields.
While `pica` works with raw bitmaps, this package operates with "image files".
Additional features are:

- \[jpeg] Apply orientation to downscaled result.
- \[jpeg] Keep metadata, but with patched orientation & removed original color
  profile.
- Easy to monkey-patch for your needs.

**[Demo](https://nodeca.github.io/image-blob-reduce/)**


Install
-------

```sh
npm install image-blob-reduce
```

Usage
-----

```js
const reduce = require('image-blob-reduce')();

//...

reduce.toBlob(image_blob, { max: 1000 })
.then(blob => { ... });
```


API
---

### new ImageBlobReduce([options])

Create new reducer. Options:

- `pica` - instance of `pica`, if you wish different defaults or shareable
  webworkers pool.

Short call: `require('image_blob_reduce')()`

### .toBlob(in_blob, { max: size }) => Promise(out_blob)

Downscale image to fit into `max`\*`max` size. If blob contains jpeg, then
orientation is applied and metadata from original image reused (with minimal
change).

### .toCanvas(in_blob, { max: size }) => Promise(out_canvas)

The same as `.toBlob()`, but with canvas output.


### .pica

Reexport of `require('pica')`, for convenience.
