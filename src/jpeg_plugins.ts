import * as image_traverse from './image_traverse'
import type { ImageBlobReduce, ImageBlobReduceEnv } from './index'

async function jpeg_patch_exif (this: ImageBlobReduce, env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
  const data = await this._getUint8Array(env.blob)

  env.is_jpeg = image_traverse.is_jpeg(data)

  if (!env.is_jpeg) return env

  env.orig_blob = env.blob

  try {
    let exif_is_big_endian: boolean | undefined
    let orientation_offset: number | undefined

    image_traverse.jpeg_exif_tags_each(data, function (entry) {
      if (entry.ifd === 0 && entry.tag === 0x112 && Array.isArray(entry.value)) {
        env.orientation = entry.value[0] || 1
        exif_is_big_endian = entry.is_big_endian
        orientation_offset = entry.data_offset
        return false
      }
    })

    if (orientation_offset) {
      const orientation_patch = exif_is_big_endian
        ? new Uint8Array([0, 1])
        : new Uint8Array([1, 0])

      env.blob = new Blob([
        data.slice(0, orientation_offset),
        orientation_patch,
        data.slice(orientation_offset + 2)
      ], { type: 'image/jpeg' })
    }
  } catch (_) {}

  return env
}

async function jpeg_rotate_canvas (this: ImageBlobReduce, env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
  if (!env.is_jpeg) return env

  const orientation = (env.orientation || 1) - 1
  if (!orientation) return env

  let canvas

  if (orientation & 4) {
    canvas = this.pica.createCanvas(env.out_canvas!.height, env.out_canvas!.width)
  } else {
    canvas = this.pica.createCanvas(env.out_canvas!.width, env.out_canvas!.height)
  }

  const ctx = canvas.getContext('2d')!

  ctx.save()

  if (orientation & 1) ctx.transform(-1, 0, 0, 1, canvas.width, 0)
  if (orientation & 2) ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height)
  if (orientation & 4) ctx.transform(0, 1, 1, 0, 0, 0)

  ctx.drawImage(env.out_canvas!, 0, 0)
  ctx.restore()

  // Safari 12 workaround
  // https://github.com/nodeca/pica/issues/199
  env.out_canvas!.width = env.out_canvas!.height = 0

  env.out_canvas = canvas

  return env
}

async function jpeg_attach_orig_segments (this: ImageBlobReduce, env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv> {
  if (!env.is_jpeg) return env

  const [data, data_out] = await Promise.all([
    this._getUint8Array(env.blob),
    this._getUint8Array(env.out_blob!)
  ])

  if (!image_traverse.is_jpeg(data)) return env

  const segments: image_traverse.JpegSegment[] = []

  image_traverse.jpeg_segments_each(data, function (segment) {
    if (segment.code === 0xDA /* SOS */) return false
    segments.push(segment)
  })

  const segment_data = segments
    .filter(function (segment) {
      // Drop ICC_PROFILE
      //
      if (segment.code === 0xE2) return false

      // Keep all APPn segments excluding APP2 (ICC_PROFILE),
      // remove others because most of them depend on image data (DCT and such).
      //
      // APP0 - JFIF, APP1 - Exif, the rest are photoshop metadata and such
      //
      // See full list at https://www.w3.org/Graphics/JPEG/itu-t81.pdf (table B.1 on page 32)
      //
      if (segment.code >= 0xE0 && segment.code < 0xF0) return true

      // Keep comments
      //
      if (segment.code === 0xFE) return true

      return false
    })
    .map(function (segment) {
      return data.slice(segment.offset, segment.offset + segment.length)
    })

  env.out_blob = new Blob(
    // intentionally omitting expected JFIF segment (offset 2 to 20)
    [data_out.slice(0, 2)].concat(segment_data).concat([data_out.slice(20)]),
    { type: 'image/jpeg' }
  )

  return env
}

function assign (reducer: ImageBlobReduce): void {
  reducer.before('_blob_to_image', jpeg_patch_exif)
  reducer.after('_transform', jpeg_rotate_canvas)
  reducer.after('_create_blob', jpeg_attach_orig_segments)
}

export {
  jpeg_patch_exif,
  jpeg_rotate_canvas,
  jpeg_attach_orig_segments,
  assign
}
