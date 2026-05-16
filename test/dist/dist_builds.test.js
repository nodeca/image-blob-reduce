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
  it('full .js build should resize', async () => {
    await loadScript('/dist/image-blob-reduce.js')

    await assertResize(window.ImageBlobReduce)
  })

  it('minified .js build should resize', async () => {
    await loadScript('/dist/image-blob-reduce.min.js')

    await assertResize(window.ImageBlobReduce)
  })

  it('ESM build should resize', async () => {
    const imageBlobReduce = (await import('/dist/image-blob-reduce.esm.mjs')).default

    await assertResize(imageBlobReduce)
  })
})
