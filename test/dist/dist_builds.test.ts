import { describe, expect, it } from 'vitest'
import type { ImageBlobReduce } from '../../src/index'

import fixtureURL from '../fixtures/test.jpg?url'

async function loadScript (url: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.onload = resolve
    script.onerror = reject
    script.src = url
    document.head.appendChild(script)
  })
}

async function fixtureBlob () {
  const response = await fetch(fixtureURL)
  return response.blob()
}

async function assertResize (imageBlobReduce: () => ImageBlobReduce): Promise<void> {
  const reducer = imageBlobReduce()
  const canvas = await reducer.toCanvas(await fixtureBlob(), { max: 10 })

  expect(canvas.width).toBe(5)
  expect(canvas.height).toBe(10)
}

describe('dist builds', () => {
  it('browser ESM .mjs build should resize', async () => {
    // @ts-expect-error runtime URL, no static types
    const mod = await import(/* @vite-ignore */ '/dist/image-blob-reduce.browser.min.mjs')
    const imageBlobReduce: (() => ImageBlobReduce) = mod.default

    expect(typeof imageBlobReduce).toBe('function')
    expect(typeof mod.ImageBlobReduce).toBe('function')
    expect(typeof mod.pica).toBe('function')

    await assertResize(imageBlobReduce)
  })

  it('browser UMD .js build should resize', async () => {
    await loadScript('/dist/image-blob-reduce.browser.min.js')

    const imageBlobReduce = (window as Window & {
      imageBlobReduce?: (() => ImageBlobReduce) & {
        ImageBlobReduce: typeof ImageBlobReduce
        pica: unknown
        Pica: unknown
      }
    }).imageBlobReduce!

    expect(typeof imageBlobReduce).toBe('function')
    expect(typeof imageBlobReduce.ImageBlobReduce).toBe('function')
    expect(typeof imageBlobReduce.pica).toBe('function')
    expect(typeof imageBlobReduce.Pica).toBe('function')
    expect(imageBlobReduce()).toBeInstanceOf(imageBlobReduce.ImageBlobReduce)

    await assertResize(imageBlobReduce)
  })
})
