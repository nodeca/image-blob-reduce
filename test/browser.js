
'use strict';

const assert         = require('assert');
const fs             = require('fs');
const path           = require('path');
const resize         = require('../')();
const image_traverse = require('../lib/image_traverse');


describe('Browser', function () {
  it('should resize down to max size', async function () {
    let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    let blob   = new Blob([ image ], { type: 'image/jpeg' });
    let canvas = await resize.toCanvas(blob, { max: 10 });

    assert.strictEqual(canvas.width, 5);
    assert.strictEqual(canvas.height, 10);
  });

  it('should fix jpeg orientation', async function () {
    let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    let blob   = new Blob([ image ], { type: 'image/jpeg' });
    let canvas = await resize.toCanvas(blob);

    assert.strictEqual(canvas.width, 16);
    assert.strictEqual(canvas.height, 32);

    let px = canvas.getContext('2d').getImageData(15, 0, 1, 1).data;
    assert.strictEqual(px[0], 0);
    assert.strictEqual(px[1], 0);
    assert.strictEqual(px[2], 0);
  });

  it('should resize into blob', async function () {
    let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    let blob   = new Blob([ image ], { type: 'image/jpeg' });
    let out    = await resize.toBlob(blob, { max: 10 });

    assert.strictEqual(out.type, 'image/jpeg');
  });

  it('should keep exif in output', async function () {
    let image    = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    let blob     = new Blob([ image ], { type: 'image/jpeg' });
    let blob_out = await resize.toBlob(blob);
    let buf      = new Uint8Array(await blob_out.arrayBuffer());

    assert(blob.size !== blob_out.size, 'blob sizes should differ');

    let old_string, old_orientation, new_string, new_orientation;

    image_traverse.jpeg_exif_tags_each(image, entry => {
      if (entry.ifd === 0 && entry.tag === 0x110) old_string = entry.value;
      if (entry.ifd === 0 && entry.tag === 0x112) old_orientation = entry.value;
    });

    image_traverse.jpeg_exif_tags_each(buf, entry => {
      if (entry.ifd === 0 && entry.tag === 0x110) new_string = entry.value;
      if (entry.ifd === 0 && entry.tag === 0x112) new_orientation = entry.value;
    });

    assert.deepStrictEqual(old_string, 'image_blob_reduce test');
    assert.deepStrictEqual(new_string, 'image_blob_reduce test');
    assert.deepStrictEqual(old_orientation, [ 6 ]);
    assert.deepStrictEqual(new_orientation, [ 1 ]);
  });
});
