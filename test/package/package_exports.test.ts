import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)

describe('package exports', () => {
  it('should resolve package root through require condition', () => {
    const imageBlobReduce = require('image-blob-reduce')
    const reducer = imageBlobReduce()

    expect(typeof imageBlobReduce).toBe('function')
    expect(typeof imageBlobReduce.ImageBlobReduce).toBe('function')
    expect(typeof imageBlobReduce.image_traverse.is_jpeg).toBe('function')
    expect(typeof imageBlobReduce.pica).toBe('function')
    expect(typeof imageBlobReduce.Pica).toBe('function')
    expect(reducer).toBeInstanceOf(imageBlobReduce.ImageBlobReduce)
  })

  it('should resolve dist files through wildcard export', async () => {
    // @ts-expect-error Runtime compatibility export; this subpath has no published types.
    const mod = await import('image-blob-reduce/dist/image-blob-reduce.js')

    expect(typeof mod.default).toBe('function')
  })
})
