import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
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

  it('should resolve browser entry through require condition', () => {
    const imageBlobReduce = require('image-blob-reduce/browser')
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

  it('should resolve browser entry through import condition', async () => {
    const mod = await import('image-blob-reduce/browser')

    expect(typeof mod.default).toBe('function')
    expect(typeof mod.ImageBlobReduce).toBe('function')
    expect(typeof mod.image_traverse.is_jpeg).toBe('function')
    expect(typeof mod.pica).toBe('function')
    expect(typeof mod.Pica).toBe('function')
  })

  it('should keep root builds external and browser builds bundled', () => {
    const rootCjs = readFileSync('dist/image-blob-reduce.js', 'utf8')
    const rootEsm = readFileSync('dist/image-blob-reduce.mjs', 'utf8')
    const browserCjs = readFileSync('dist/image-blob-reduce.browser.min.js', 'utf8')
    const browserEsm = readFileSync('dist/image-blob-reduce.browser.min.mjs', 'utf8')

    expect(rootCjs).toContain('require("pica")')
    expect(rootCjs).toContain('module.exports = imageBlobReduceWithStatic')
    expect(rootCjs).not.toContain('factory(')
    expect(rootCjs).not.toContain('define.amd')
    expect(rootEsm).toContain('from "pica"')
    expect(browserCjs).not.toContain('require("pica")')
    expect(browserEsm).not.toContain('from "pica"')
    expect(existsSync('dist/image-blob-reduce.js.map')).toBe(true)
    expect(existsSync('dist/image-blob-reduce.mjs.map')).toBe(true)
    expect(existsSync('dist/image-blob-reduce.browser.min.js.map')).toBe(true)
    expect(existsSync('dist/image-blob-reduce.browser.min.mjs.map')).toBe(true)
  })
})
