import { describe, expect, it } from 'vitest'

import fixtureURL from '../fixtures/test.jpg?url'

async function fixtureBlob () {
  const response = await fetch(fixtureURL)
  return response.blob()
}

async function fixtureBytes () {
  return new Uint8Array(await (await fixtureBlob()).arrayBuffer())
}

async function createReducer () {
  const imageBlobReduce = (await import('image-blob-reduce')).default

  return imageBlobReduce()
}

describe('image_blob_reduce browser API', () => {
  it('should expose ESM factory, class and helper exports', async () => {
    const mod = await import('image-blob-reduce')
    const defaultExport = mod.default as typeof mod.default & {
      pica?: unknown
      Pica?: unknown
      ImageBlobReduce?: unknown
      image_traverse?: unknown
    }
    const reducer = mod.default()

    expect(typeof mod.default).toBe('function')
    expect(typeof mod.ImageBlobReduce).toBe('function')
    expect(reducer).toBeInstanceOf(mod.ImageBlobReduce)
    expect(typeof mod.image_traverse.is_jpeg).toBe('function')
    expect(typeof mod.pica).toBe('function')
    expect(typeof mod.Pica).toBe('function')
    expect(defaultExport.pica).toBeUndefined()
    expect(defaultExport.Pica).toBeUndefined()
    expect(defaultExport.ImageBlobReduce).toBeUndefined()
    expect(defaultExport.image_traverse).toBeUndefined()
  })

  it('should resize down to max size', async () => {
    const reducer = await createReducer()
    const canvas = await reducer.toCanvas(await fixtureBlob(), { max: 10 })

    expect(canvas.width).toBe(5)
    expect(canvas.height).toBe(10)
  })

  it('should fix jpeg orientation', async () => {
    const reducer = await createReducer()
    const canvas = await reducer.toCanvas(await fixtureBlob())

    expect(canvas.width).toBe(16)
    expect(canvas.height).toBe(32)

    const px = canvas.getContext('2d')!.getImageData(15, 0, 1, 1).data

    expect(px[0]).toBe(0)
    expect(px[1]).toBe(0)
    expect(px[2]).toBe(0)
  })

  it('should resize into blob', async () => {
    const reducer = await createReducer()
    const out = await reducer.toBlob(await fixtureBlob(), { max: 10 })

    expect(out.type).toBe('image/jpeg')
  })

  it('should create a different jpeg blob from the resized image', async () => {
    const reducer = await createReducer()
    const blob = await fixtureBlob()
    const blob_out = await reducer.toBlob(blob, { max: 10 })
    const image = await fixtureBytes()

    expect(image.length).toBe(blob.size)
    expect(blob.size).not.toBe(blob_out.size)
    expect(blob_out.type).toBe('image/jpeg')
  })
})
