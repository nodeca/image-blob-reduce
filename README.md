image-blob-reduce - downscale blobs with images inside
======================================================

[![CI](https://github.com/nodeca/image-blob-reduce/actions/workflows/ci.yml/badge.svg)](https://github.com/nodeca/image-blob-reduce/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/image-blob-reduce.svg)](https://www.npmjs.org/package/image-blob-reduce)


> Wrapper for [pica](https://github.com/nodeca/pica) to work with blobs, with
> some sugar.

This is a `pica` wrapper for convenient work with images from file input fields.
While `pica` works with raw bitmaps, this package operates with "image files".
Additional features are:

- \[jpeg] Apply orientation to the downscaled result.
- \[jpeg] Keep metadata, but with patched orientation and the original color
  profile removed.
- Easy to monkey-patch for your needs.

**[Demo](https://nodeca.github.io/image-blob-reduce/demo/)**


Install
-------

```sh
npm install image-blob-reduce
```


Usage
-----

```mjs
import imageBlobReduce from 'image-blob-reduce'

const reduce = imageBlobReduce()

//...

reduce
  .toBlob(image_blob, { max: 1000 })
  .then(blob => { ... })
```

If you load the prebuilt UMD script in a browser, use
`window.imageBlobReduce`.

> [!NOTE]
> For a quick look at `dist/` folder contents, see
> <https://unpkg.com/image-blob-reduce@latest/>.


API
---

### imageBlobReduce([options])

Create a new reducer instance.

```mjs
import imageBlobReduce, { ImageBlobReduce } from 'image-blob-reduce'

const reduce = imageBlobReduce()

reduce instanceof ImageBlobReduce // true
```


### new ImageBlobReduce([options])

Create a new reducer. Options:

- `pica` - a `pica` instance, if you want different defaults or a shared
  web worker pool.


### .toBlob(in_blob, options) => Promise(out_blob)

Downscale an image so its width and height fit within `max`\*`max` pixels. For
example, `{ max: 1000 }` limits the longest side to 1000 px; it does not limit
the output blob size in bytes. If the blob contains a JPEG, orientation is
applied and metadata from the original image is reused (with minimal changes).

Options:

- __max__ - max allowed width/height, in pixels.
- __pica `.resize()` options__ - `quality`, `filter`, `unsharpAmount`,
  `unsharpRadius`, `unsharpThreshold`, `cancelToken`


### .toCanvas(in_blob, options) => Promise(out_canvas)

The same as `.toBlob()`, but with canvas output.


### .before(method_name, hook_fn)

Inject your custom handler before the specified method. See the `.setup()`
source code for an example.


### .after(method_name, hook_fn)

The same as `.before()`, but the handler is injected after the specified
method.


### .use(plugin_init, ...params) => this

Sugar to simplify the assignment of external plugins. Just calls
`plugin_init(this, ...params)`.


### .setup()

Configure the instance before first use. By default, installs the built-in JPEG
hooks. Override this method if you need to install custom plugins, add hooks or
replace pipeline methods before processing starts.


### Reexports

```mjs
import imageBlobReduce, { ImageBlobReduce, image_traverse, pica, Pica } from 'image-blob-reduce'
```

- `imageBlobReduce` - default factory.
- `ImageBlobReduce` - reducer constructor.
- `image_traverse` - JPEG traversal helpers.
- `pica` - `pica` factory.
- `Pica` - `pica` constructor.

Legacy static fields are available only in UMD build:

- `window.imageBlobReduce.ImageBlobReduce`
- `window.imageBlobReduce.image_traverse`
- `window.imageBlobReduce.pica`
- `window.imageBlobReduce.Pica`


## Customization

Since it's difficult to implement all possible options, this package is
specially designed for easy customization. See the source code first.

- You can inherit from the class & replace existing methods.
- You can add extra actions before/after existing methods.
- You can override existing methods of an instance.

For example, if you wish to force output to always be JPEG with a certain
quality:

```mjs
import imageBlobReduce from 'image-blob-reduce'

const reducer = imageBlobReduce()

reducer._create_blob = function (env) {
  return this.pica.toBlob(env.out_canvas, 'image/jpeg', 0.8)
    .then(function (blob) {
      env.out_blob = blob
      return env
    })
}
```

Or rewrite the scaling logic, introducing a `min` option instead:

```mjs
import imageBlobReduce from 'image-blob-reduce'

const reducer = imageBlobReduce()

reducer._calculate_size = function (env) {
  const scale_factor = env.opts.min / Math.min(env.image.width, env.image.height)

  if (scale_factor > 1) scale_factor = 1

  env.transform_width = Math.max(Math.round(env.image.width * scale_factor), 1)
  env.transform_height = Math.max(Math.round(env.image.height * scale_factor), 1)

  return env
}
```
