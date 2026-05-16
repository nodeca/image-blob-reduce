import pica, { Pica } from 'pica'
import * as jpeg_plugins from './jpeg_plugins.mjs'
import * as utils from './utils.mjs'

class ImageBlobReduce {
  constructor (options) {
    options = options || {}

    this.pica = options.pica || pica({})
    this.initialized = false

    this.utils = utils
  }

  use (plugin, ...params) {
    const args = [this].concat(params)
    plugin.apply(plugin, args)
    return this
  }

  init () {
    this.use(jpeg_plugins.assign)
  }

  toBlob (blob, options) {
    const opts = utils.assign({ max: Infinity }, options)
    const env = {
      blob,
      opts
    }

    if (!this.initialized) {
      this.init()
      this.initialized = true
    }

    return Promise.resolve(env)
      .then(this._blob_to_image)
      .then(this._calculate_size)
      .then(this._transform)
      .then(this._cleanup)
      .then(this._create_blob)
      .then(function (_env) {
        // Safari 12 workaround
        // https://github.com/nodeca/pica/issues/199
        _env.out_canvas.width = _env.out_canvas.height = 0

        return _env.out_blob
      })
  }

  toCanvas (blob, options) {
    const opts = utils.assign({ max: Infinity }, options)
    const env = {
      blob,
      opts
    }

    if (!this.initialized) {
      this.init()
      this.initialized = true
    }

    return Promise.resolve(env)
      .then(this._blob_to_image)
      .then(this._calculate_size)
      .then(this._transform)
      .then(this._cleanup)
      .then(function (_env) { return _env.out_canvas })
  }

  before (method_name, fn) {
    if (!this[method_name]) throw new Error('Method "' + method_name + '" does not exist')
    if (typeof fn !== 'function') throw new Error('Invalid argument "fn", function expected')

    const old_fn = this[method_name]
    const self = this

    this[method_name] = function (env) {
      return fn.call(self, env).then(function (_env) {
        return old_fn.call(self, _env)
      })
    }

    return this
  }

  after (method_name, fn) {
    if (!this[method_name]) throw new Error('Method "' + method_name + '" does not exist')
    if (typeof fn !== 'function') throw new Error('Invalid argument "fn", function expected')

    const old_fn = this[method_name]
    const self = this

    this[method_name] = function (env) {
      return old_fn.call(self, env).then(function (_env) {
        return fn.call(self, _env)
      })
    }

    return this
  }

  _blob_to_image (env) {
    const URL = window.URL || window.webkitURL || window.mozURL || window.msURL

    env.image = document.createElement('img')
    env.image_url = URL.createObjectURL(env.blob)
    env.image.src = env.image_url

    return new Promise(function (resolve, reject) {
      env.image.onerror = function () { reject(new Error('ImageBlobReduce: failed to create Image() from blob')) }
      env.image.onload = function () { resolve(env) }
    })
  }

  _calculate_size (env) {
    //
    // Note, if your need not "symmetric" resize logic, you MUST check
    // `env.orientation` (set by plugins) and swap width/height appropriately.
    //
    let scale_factor = env.opts.max / Math.max(env.image.width, env.image.height)

    if (scale_factor > 1) scale_factor = 1

    env.transform_width = Math.max(Math.round(env.image.width * scale_factor), 1)
    env.transform_height = Math.max(Math.round(env.image.height * scale_factor), 1)

    // Info for user plugins, to check if scaling applied
    env.scale_factor = scale_factor

    return Promise.resolve(env)
  }

  _transform (env) {
    const self = this

    return Promise.resolve(this.pica.init ? this.pica.init() : this.pica)
      .then(function () {
        env.out_canvas = self.pica.createCanvas(env.transform_width, env.transform_height)

        // Dim env temporary vars to prohibit use and avoid confusion when orientation
        // changed. You should take real size from canvas.
        env.transform_width = null
        env.transform_height = null

        // By default use alpha for png only
        const pica_opts = { alpha: env.blob.type === 'image/png' }

        // Extract pica options if been passed
        self.utils.assign(pica_opts, self.utils.pick_pica_resize_options(env.opts))

        return self.pica
          .resize(env.image, env.out_canvas, pica_opts)
          .then(function () { return env })
      })
  }

  _cleanup (env) {
    env.image.src = ''
    env.image = null

    const URL = window.URL || window.webkitURL || window.mozURL || window.msURL
    if (URL.revokeObjectURL) URL.revokeObjectURL(env.image_url)

    env.image_url = null

    return Promise.resolve(env)
  }

  _create_blob (env) {
    return this.pica.toBlob(env.out_canvas, env.blob.type)
      .then(function (blob) {
        env.out_blob = blob
        return env
      })
  }

  _getUint8Array (blob) {
    if (blob.arrayBuffer) {
      return blob.arrayBuffer().then(function (buf) {
        return new Uint8Array(buf)
      })
    }

    return new Promise(function (resolve, reject) {
      const fr = new FileReader()

      fr.readAsArrayBuffer(blob)

      fr.onload = function () { resolve(new Uint8Array(fr.result)) }
      fr.onerror = function () {
        reject(new Error('ImageBlobReduce: failed to load data from input blob'))
        fr.abort()
      }
      fr.onabort = function () {
        reject(new Error('ImageBlobReduce: failed to load data from input blob (aborted)'))
      }
    })
  }
}

function imageBlobReduce (options) {
  return new ImageBlobReduce(options)
}

export {
  ImageBlobReduce,
  pica,
  Pica
}

export default imageBlobReduce
