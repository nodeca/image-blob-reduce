import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import * as image_traverse from '../../lib/image_traverse.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readFixture () {
  return fs.readFileSync(path.join(__dirname, '../fixtures/test.jpg'))
}

describe('image_traverse', () => {
  it('is_jpeg', () => {
    const image = readFixture()

    expect(image_traverse.is_jpeg(image)).toBe(true)

    image[1] = 0xFF
    expect(image_traverse.is_jpeg(image)).toBe(false)
  })

  describe('jpeg_segments_each', () => {
    it('should begin with SOI and end with EOI', () => {
      const image = readFixture()
      const segments = []

      image_traverse.jpeg_segments_each(image, segment => segments.push(segment))

      expect(segments[0].code).toBe(0xD8)
      expect(segments[segments.length - 1].code).toBe(0xD9)
    })
  })

  describe('jpeg_segments_filter', () => {
    it('output should be Uint8Array', () => {
      const image = readFixture()
      const result = image_traverse.jpeg_segments_filter(image, () => {})

      expect(result).toBeInstanceOf(Uint8Array)
    })
  })

  describe('jpeg_exif_tags_each', () => {
    it('should iterate through exif', () => {
      const expected_exif_fields = {
        '0:272:2:23': 'image_blob_reduce test',
        '0:274:3:1': [6],
        '0:282:5:1': null,
        '0:283:5:1': null,
        '0:296:3:1': [2],
        '0:531:3:1': [1],
        '0:34853:4:1': [138],
        '34853:0:1:4': [2, 3, 0, 0],
        '34853:2:5:3': null,
        '34853:4:5:3': null,
        '1:513:4:1': [258],
        '1:514:4:1': [658]
      }
      const image = readFixture()
      const entries = {}

      image_traverse.jpeg_exif_tags_each(image, entry => {
        entries[entry.ifd + ':' + entry.tag + ':' + entry.format + ':' + entry.count] = entry.value
      })

      expect(entries).toEqual(expected_exif_fields)
    })
  })

  describe('jpeg_exif_tags_filter', () => {
    it('output should be Uint8Array', () => {
      const image = readFixture()
      const result = image_traverse.jpeg_exif_tags_filter(image, () => {})

      expect(result).toBeInstanceOf(Uint8Array)
    })

    it('output should have same tags as input', () => {
      const image = readFixture()
      const result = image_traverse.jpeg_exif_tags_filter(image, () => {})
      const entries1 = {}
      const entries2 = {}

      image_traverse.jpeg_exif_tags_each(image, entry => {
        if (entry.ifd === 1) return // thumbnails not supported yet
        entries1[entry.ifd + ':' + entry.tag + ':' + entry.format + ':' + entry.count] = entry.value
      })

      image_traverse.jpeg_exif_tags_each(result, entry => {
        if (entry.ifd === 1) return // thumbnails not supported yet
        entries2[entry.ifd + ':' + entry.tag + ':' + entry.format + ':' + entry.count] = entry.value
      })

      expect(entries2).toEqual(entries1)
    })
  })

  describe('jpeg_add_comment', () => {
    it('should insert comment segment', () => {
      const image = readFixture()
      const result = image_traverse.jpeg_add_comment(image, '1')
      const segments_in = []
      const segments_out = []

      image_traverse.jpeg_segments_each(image, segment => segments_in.push(segment) < 4)
      image_traverse.jpeg_segments_each(result, segment => segments_out.push(segment) < 4)

      expect(segments_out[0].code).toBe(0xD8)
      expect(segments_out[1].code).toBe(0xE0)
      expect(segments_out[1].length).toBe(segments_in[1].length)
      expect(segments_out[2].code).toBe(0xFE)
      expect(segments_out[3].code).toBe(segments_in[2].code)
      expect(segments_out[3].length).toBe(segments_in[2].length)
    })

    it('should encode input as utf8', () => {
      const image = readFixture()
      const result = image_traverse.jpeg_add_comment(image, 'тест')
      const segments_out = []

      image_traverse.jpeg_segments_each(result, segment => segments_out.push(segment) < 3)

      const comment = result.subarray(segments_out[2].offset, segments_out[2].offset + segments_out[2].length)

      expect(String.fromCharCode(...comment)).toBe('\xff\xfe\x00\x0b\xd1\x82\xd0\xb5\xd1\x81\xd1\x82\x00')
    })
  })
})
