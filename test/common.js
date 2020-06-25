
'use strict';


const assert         = require('assert');
const fs             = require('fs');
const path           = require('path');
const image_traverse = require('../lib/image_traverse');


describe('Common', function () {
  it('is_jpeg', function () {
    let image = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    assert(image_traverse.is_jpeg(image));
    image[1] = 0xFF;
    assert(!image_traverse.is_jpeg(image));
  });

  describe('jpeg_segments_each', function () {
    it('should begin with SOI and end with EOI', function () {
      let image = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let segments = [];
      image_traverse.jpeg_segments_each(image, segment => segments.push(segment));
      assert.strictEqual(segments[0].code, 0xD8);
      assert.strictEqual(segments[segments.length - 1].code, 0xD9);
    });
  });

  describe('jpeg_segments_filter', function () {
    it('output should be Uint8Array', async function () {
      let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let result = image_traverse.jpeg_segments_filter(image, () => {});
      assert(result instanceof Uint8Array);
    });
  });

  describe('jpeg_exif_tags_each', function () {
    it('should iterate through exif', async function () {
      let expected_exif_fields = {
        '0:272:2:23': 'image_blob_reduce test',
        '0:274:3:1': [ 6 ],
        '0:282:5:1': null,
        '0:283:5:1': null,
        '0:296:3:1': [ 2 ],
        '0:531:3:1': [ 1 ],
        '0:34853:4:1': [ 138 ],
        '34853:0:1:4': [ 2, 3, 0, 0 ],
        '34853:2:5:3': null,
        '34853:4:5:3': null,
        '1:513:4:1': [ 258 ],
        '1:514:4:1': [ 658 ]
      };
      let image   = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let entries = {};
      image_traverse.jpeg_exif_tags_each(image, entry => {
        entries[entry.ifd + ':' + entry.tag + ':' + entry.format + ':' + entry.count] = entry.value;
      });
      assert.deepEqual(entries, expected_exif_fields);
    });
  });

  describe('jpeg_exif_tags_filter', function () {
    it('output should be Uint8Array', async function () {
      let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let result = image_traverse.jpeg_exif_tags_filter(image, () => {});
      assert(result instanceof Uint8Array);
    });

    it('output should have same tags as input', async function () {
      let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let result = image_traverse.jpeg_exif_tags_filter(image, () => {});
      let entries1 = {};
      let entries2 = {};
      image_traverse.jpeg_exif_tags_each(image, entry => {
        if (entry.ifd === 1) return; // thumbnails not supported yet
        entries1[entry.ifd + ':' + entry.tag + ':' + entry.format + ':' + entry.count] = entry.value;
      });
      image_traverse.jpeg_exif_tags_each(result, entry => {
        if (entry.ifd === 1) return; // thumbnails not supported yet
        entries2[entry.ifd + ':' + entry.tag + ':' + entry.format + ':' + entry.count] = entry.value;
      });
      assert.deepEqual(entries1, entries2);
    });
  });

  describe('jpeg_add_comment', function () {
    it('should insert comment segment', async function () {
      let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let result = image_traverse.jpeg_add_comment(image, '1');
      let segments_in = [];
      let segments_out = [];
      image_traverse.jpeg_segments_each(image, segment => segments_in.push(segment) < 4);
      image_traverse.jpeg_segments_each(result, segment => segments_out.push(segment) < 4);

      assert.strictEqual(segments_out[0].code, 0xD8);
      assert.strictEqual(segments_out[1].code, 0xE0);
      assert.strictEqual(segments_out[1].length, segments_in[1].length);
      assert.strictEqual(segments_out[2].code, 0xFE);
      assert.strictEqual(segments_out[3].code, segments_in[2].code);
      assert.strictEqual(segments_out[3].length, segments_in[2].length);
    });

    it('should encode input as utf8', async function () {
      let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
      let result = image_traverse.jpeg_add_comment(image, 'тест');
      let segments_out = [];
      image_traverse.jpeg_segments_each(result, segment => segments_out.push(segment) < 3);

      let comment = result.subarray(segments_out[2].offset, segments_out[2].offset + segments_out[2].length);
      assert.strictEqual(String.fromCharCode(...comment), '\xff\xfe\x00\x0b\xd1\x82\xd0\xb5\xd1\x81\xd1\x82\x00');
    });
  });
});
