import pica, { Pica } from 'pica'
import type { PicaCanvas, ResizeOptions as PicaResizeOptions } from 'pica'
import * as image_traverse from './image_traverse'
import * as jpeg_plugins from './jpeg_plugins'

interface ImageBlobReduceOptions {
  pica?: Pica
}

type ImageBlobReduceResizeOptions = PicaResizeOptions & {
  max?: number
}

interface ImageBlobReduceEnv {
  blob: Blob
  opts: ImageBlobReduceResizeOptions & { max: number }
  image?: HTMLImageElement | null
  image_url?: string | null
  transform_width?: number | null
  transform_height?: number | null
  scale_factor?: number
  out_canvas?: PicaCanvas
  out_blob?: Blob
  is_jpeg?: boolean
  orig_blob?: Blob
  orientation?: number
}

type PipelineMethod = (env: ImageBlobReduceEnv) => Promise<ImageBlobReduceEnv>
type HookMethodName = '_blob_to_image' | '_calculate_size' | '_transform' | '_cleanup' | '_create_blob'
type Hook = (this: ImageBlobReduce, env: ImageBlobReduceEnv) => Promise<ImageBlobReduceEnv>
type Plugin = (reducer: ImageBlobReduce, ...params: unknown[]) => void

interface ObjectURLAPI {
  createObjectURL: (blob: Blob) => string
  revokeObjectURL?: (url: string) => void
}

type LegacyWindow = Window & {
  URL: ObjectURLAPI
  webkitURL?: ObjectURLAPI
  mozURL?: ObjectURLAPI
  msURL?: ObjectURLAPI
}

class ImageBlobReduce {
  pica: Pica
  initialized: boolean

  constructor (options?: ImageBlobReduceOptions) {
    options = options || {}

    this.pica = options.pica || pica({})
    this.initialized = false
  }

  use (plugin: Plugin, ...params: unknown[]): this {
    plugin(this, ...params)
    return this
  }

  init (): void {
    this.use(jpeg_plugins.assign)
  }

  async toBlob (blob: Blob, options?: ImageBlobReduceResizeOptions): Promise<Blob> {
    const opts = { max: Infinity, ...options }
    let env: ImageBlobReduceEnv = {
      blob,
      opts
    }

    if (!this.initialized) {
      this.init()
      this.initialized = true
    }

    env = await this._blob_to_image(env)
    env = await this._calculate_size(env)
    env = await this._transform(env)
    env = await this._cleanup(env)
    env = await this._create_blob(env)

    // Safari 12 workaround
    // https://github.com/nodeca/pica/issues/199
    env.out_canvas!.width = env.out_canvas!.height = 0

    return env.out_blob!
  }

  async toCanvas (blob: Blob, options?: ImageBlobReduceResizeOptions): Promise<PicaCanvas> {
    const opts = { max: Infinity, ...options }
    let env: ImageBlobReduceEnv = {
      blob,
      opts
    }

    if (!this.initialized) {
      this.init()
      this.initialized = true
    }

    env = await this._blob_to_image(env)
    env = await this._calculate_size(env)
    env = await this._transform(env)
    env = await this._cleanup(env)

    return env.out_canvas!
  }

  before (method_name: HookMethodName, fn: Hook): this {
    if (!this[method_name]) throw new Error('Method "' + method_name + '" does not exist')
    if (typeof fn !== 'function') throw new Error('Invalid argument "fn", function expected')

    const old_fn = this[method_name] as PipelineMethod

    this[method_name] = (async (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> => {
      const _env = await fn.call(this, env)
      return old_fn.call(this, _env)
    }) as this[HookMethodName]

    return this
  }

  after (method_name: HookMethodName, fn: Hook): this {
    if (!this[method_name]) throw new Error('Method "' + method_name + '" does not exist')
    if (typeof fn !== 'function') throw new Error('Invalid argument "fn", function expected')

    const old_fn = this[method_name] as PipelineMethod

    this[method_name] = (async (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> => {
      const _env = await old_fn.call(this, env)
      return fn.call(this, _env)
    }) as this[HookMethodName]

    return this
  }

  _blob_to_image (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
    const win = window as LegacyWindow
    const URL = win.URL || win.webkitURL || win.mozURL || win.msURL

    env.image = document.createElement('img')
    env.image_url = URL!.createObjectURL(env.blob)
    env.image.src = env.image_url

    return new Promise(function (resolve: (env: ImageBlobReduceEnv) => void, reject) {
      env.image!.onerror = function () { reject(new Error('ImageBlobReduce: failed to create Image() from blob')) }
      env.image!.onload = function () { resolve(env) }
    })
  }

  async _calculate_size (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
    //
    // Note, if your need not "symmetric" resize logic, you MUST check
    // `env.orientation` (set by plugins) and swap width/height appropriately.
    //
    let scale_factor = env.opts.max / Math.max(env.image!.width, env.image!.height)

    if (scale_factor > 1) scale_factor = 1

    env.transform_width = Math.max(Math.round(env.image!.width * scale_factor), 1)
    env.transform_height = Math.max(Math.round(env.image!.height * scale_factor), 1)

    // Info for user plugins, to check if scaling applied
    env.scale_factor = scale_factor

    return env
  }

  async _transform (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
    await (this.pica.init ? this.pica.init() : this.pica)

    env.out_canvas = this.pica.createCanvas(env.transform_width!, env.transform_height!)

    // Dim env temporary vars to prohibit use and avoid confusion when orientation
    // changed. You should take real size from canvas.
    env.transform_width = null
    env.transform_height = null

    const { max, ...pica_opts } = env.opts

    await this.pica.resize(env.image!, env.out_canvas, pica_opts)

    return env
  }

  async _cleanup (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
    env.image!.src = ''
    env.image = null

    const win = window as LegacyWindow
    const URL = win.URL || win.webkitURL || win.mozURL || win.msURL
    if (URL!.revokeObjectURL) URL!.revokeObjectURL(env.image_url!)

    env.image_url = null

    return env
  }

  async _create_blob (env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
    env.out_blob = await this.pica.toBlob(env.out_canvas!, env.blob.type)
    return env
  }

  async _getUint8Array (blob: Blob): Promise<Uint8Array> {
    if (blob.arrayBuffer) {
      return new Uint8Array(await blob.arrayBuffer())
    }

    return new Promise(function (resolve: (data: Uint8Array) => void, reject) {
      const fr = new FileReader()

      fr.readAsArrayBuffer(blob)

      fr.onload = function () { resolve(new Uint8Array(fr.result as ArrayBuffer)) }
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

function imageBlobReduce (options?: ImageBlobReduceOptions): ImageBlobReduce {
  return new ImageBlobReduce(options)
}

export {
  ImageBlobReduce,
  image_traverse,
  pica,
  Pica
}

export type {
  ImageBlobReduceEnv,
  ImageBlobReduceOptions,
  ImageBlobReduceResizeOptions,
  Hook as ImageBlobReduceHook,
  HookMethodName as ImageBlobReduceHookMethodName,
  Plugin as ImageBlobReducePlugin
}

export default imageBlobReduce
