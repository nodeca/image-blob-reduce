3.0.1 / 2021-06-17
------------------

- Bumped `pica` to v7.1.0.
- Return error when canvas data read blocked by fingerprint protection, #28.


3.0.0 / 2021-05-23
------------------

- Bumped `pica` to v7.0.0. See pica docs for unsharp mask & options change.


2.2.3 / 2021-04-19
------------------

- Original Exif is now appended to resized JPEG image, #26.


2.2.2 / 2021-01-15
------------------

- Fix minified build.


2.2.1 / 2020-12-30
------------------

- Add lib/image-traverse to package.json exports.


2.2.0 / 2020-12-18
------------------

- Exports package.json, needed for react-native and some bundlers, #19.


2.1.1 / 2020-11-17
------------------

- Rename module build .js => .mjs to fix node import


2.1.0 / 2020-11-12
------------------

- Added es6 modules support, #16.


2.0.0 / 2020-10-15
------------------

- Drop deprecated `.to_blob()` & `to_canvas()` (use `.toBlob()` & `toCanvas()`
  instead).
- Added separate `._calculate_size()` to simplify logic override.
- browserify => rollup.js.
- Global name in browser changed to `window.ImageBlobReduce`.


1.0.7 / 2020-08-20
------------------

- Added Safari canvas GC workaround,  https://github.com/nodeca/pica/issues/199.


1.0.6 / 2020-07-31
------------------

- Fix: jpeg plugin should create canvas via `pica`.


1.0.5 / 2020-07-26
------------------

- Added `.use()` method.
- Check output blob type before transfer EXIF header.


1.0.4 / 2020-07-14
------------------

- Fixed public method names. Should be `.toCanvas()` and `.toBlob()`, as in doc.
  Old names are left as aliases until 2.0 and will be removed.


1.0.3 / 2020-07-11
------------------

- Create canvas via pica helper.
- Rearrange utilities to simplify modifications.


1.0.2 / 2020-07-11
------------------

- Added `pica` options support (`alpha`, `unsharpAmount`, `unsharpRadius`,
  `unsharpThreshold`, `cancelToken`).
- `pica` version bump.


1.0.1 / 2020-06-25
------------------

- Added `pica` to module exports.


1.0.0 / 2020-06-25
------------------

- First release.
