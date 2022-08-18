import pica from "pica"

declare class ImageBlobReduce {
  constructor(options?: imageBlobReduce.Options)

  use(plugin: (args: any[]) => any): ImageBlobReduce

  init()

  toBlob(blob: Blob, options?: imageBlobReduce.ResizeOptions): Promise<Blob>

  toCanvas(blob: Blob, options?: imageBlobReduce.ResizeOptions): Promise<HTMLCanvasElement>

  before(method_name: string, fn: (env: imageBlobReduce.Env) => Promise<imageBlobReduce.Env>)

  after(method_name: string, fn: (env: imageBlobReduce.Env) => Promise<imageBlobReduce.Env>)
}

declare namespace imageBlobReduce {
  interface Options {
    pica?: pica.PicaStatic
  }

  interface Env {
    blob: Blob
    opts: ResizeOptions
    [others: string]: any
  }

  interface ResizeOptions {
    alpha?: boolean
    unsharpAmount?: number | undefined;
    unsharpRadius?: number | undefined;
    unsharpThreshold?: number | undefined;
    cancelToken?: Promise<unknown> | undefined;
    max?: number
  }
}

export = ImageBlobReduce
