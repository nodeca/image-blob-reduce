
'use strict';


var image_traverse = require('./image_traverse');


module.exports.jpeg_patch_exif = function (env) {
  return this._getUint8Array(env.blob).then(function (data) {
    env.is_jpeg = image_traverse.is_jpeg(data);
    if (!env.is_jpeg) return Promise.resolve(env);

    env.orig_blob = env.blob;

    try {
      var exif_is_big_endian, orientation_offset;

      /* eslint-disable consistent-return */
      image_traverse.jpeg_exif_tags_each(data, function (entry) {
        if (entry.ifd === 0 && entry.tag === 0x112 && Array.isArray(entry.value)) {
          env.orientation    = entry.value[0] || 1;
          exif_is_big_endian = entry.big_endian;
          orientation_offset = entry.data_offset;
          return false;
        }
      });

      if (orientation_offset) {
        var orientation_patch = exif_is_big_endian ?
          new Uint8Array([ 0, 1 ]) :
          new Uint8Array([ 1, 0 ]);

        env.blob = new Blob([
          data.slice(0, orientation_offset),
          orientation_patch,
          data.slice(orientation_offset + 2)
        ], { type: 'image/jpeg' });
      }
    } catch (_) {}

    return env;
  });
};


module.exports.jpeg_rotate_canvas = function (env) {
  if (!env.is_jpeg) return Promise.resolve(env);

  var orientation = env.orientation - 1;
  if (!orientation) return Promise.resolve(env);

  var canvas = document.createElement('canvas');

  if (orientation & 4) {
    canvas.width  = env.out_canvas.height;
    canvas.height = env.out_canvas.width;
  } else {
    canvas.width  = env.out_canvas.width;
    canvas.height = env.out_canvas.height;
  }

  var ctx = canvas.getContext('2d');

  ctx.save();

  if (orientation & 1) ctx.transform(-1, 0, 0, 1, canvas.width, 0);
  if (orientation & 2) ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height);
  if (orientation & 4) ctx.transform(0, 1, 1, 0, 0, 0);

  ctx.drawImage(env.out_canvas, 0, 0);
  ctx.restore();

  env.out_canvas = canvas;

  return Promise.resolve(env);
};


module.exports.jpeg_attach_orig_segments = function (env) {
  if (!env.is_jpeg) return Promise.resolve(env);

  return this._getUint8Array(env.blob).then(function (data) {
    var segments = [];

    image_traverse.jpeg_segments_each(data, function (segment) {
      if (segment.code === 0xDA /* SOS */) return false;
      segments.push(segment);
    });

    segments = segments
      .filter(function (segment) {
        if (segment.code === 0xE2) {
          var hdr = data.slice(segment.offset + 4, segment.offset + 11);
          if (String.fromCharCode.apply(hdr) === 'ICC_PROFILE') {
            return false;
          }
        }

        // Keep all APPn segments excluding APP2 (ICC_PROFILE),
        // remove others because most of them depend on image data (DCT and such).
        //
        // APP0 - JFIF, APP1 - Exif, the rest are photoshop metadata and such
        //
        // See full list at https://www.w3.org/Graphics/JPEG/itu-t81.pdf (table B.1 on page 32)
        //
        if (segment.code >= 0xE0 && segment.code < 0xF0) return true;

        // Keep comments
        //
        if (segment.code === 0xFE) return true;

        return false;
      })
      .map(function (segment) {
        return data.slice(segment.offset, segment.offset + segment.length);
      });

    env.blob = new Blob([]
      .concat([ data.slice(0, 20) ])
      .concat(segments)
      .concat([ data.slice(20) ])
    , { type: 'image/jpeg' });

    return env;
  });
};
