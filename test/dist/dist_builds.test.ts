import { describe, expect, it } from 'vitest'

import fixtureURL from '../fixtures/test.jpg?url'

async function loadScript (url) {
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

async function assertResize (imageBlobReduce) {
  const reducer = imageBlobReduce()
  const canvas = await reducer.toCanvas(await fixtureBlob(), { max: 10 })

  expect(canvas.width).toBe(5)
  expect(canvas.height).toBe(10)
}

describe('dist builds', () => {
  it('UMD .js build should resize', async () => {
    await loadScript('/dist/image-blob-reduce.js')

    const win = window as any

    expect(typeof win.imageBlobReduce).toBe('function')
    expect(typeof win.imageBlobReduce.ImageBlobReduce).toBe('function')
    expect(typeof win.imageBlobReduce.pica).toBe('function')
    expect(typeof win.imageBlobReduce.Pica).toBe('function')
    expect(win.imageBlobReduce()).toBeInstanceOf(win.imageBlobReduce.ImageBlobReduce)

    await assertResize(win.imageBlobReduce)
  })
})
