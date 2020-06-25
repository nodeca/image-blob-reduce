
'use strict';

const assert = require('assert');
const fs     = require('fs');
const path   = require('path');
const resize = require('../')();


describe('Browser', function () {
  it('should resize down to max size', async function () {
    let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    let blob   = new Blob([ image ], { type: 'image/jpeg' });
    let canvas = await resize.to_canvas(blob, { max: 10 });

    assert.strictEqual(canvas.width, 5);
    assert.strictEqual(canvas.height, 10);
  });

  it('should fix jpeg orientation', async function () {
    let image  = fs.readFileSync(path.join(__dirname, 'test.jpg'));
    let blob   = new Blob([ image ], { type: 'image/jpeg' });
    let canvas = await resize.to_canvas(blob);

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
    let out    = await resize.to_blob(blob, { max: 10 });

    assert.strictEqual(out.type, 'image/jpeg');
  });
});
