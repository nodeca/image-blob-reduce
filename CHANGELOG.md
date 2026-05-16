# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unpublished]
### Added
- Added separate ESM exports: default `imageBlobReduce` factory and named
  `ImageBlobReduce` constructor.
- Reexported `pica` factory and `Pica` constructor from package root.

### Changed
- Converted sources and tests to native ESM.
- Bumped `pica` to v10.0.0.
- Keep only one unminified ES2015 UMD build for legacy browser usage.
- Changed UMD global to `window.imageBlobReduce`; legacy static fields are
  exposed on UMD factory only.
- Removed generated `dist/` from repository; it is created during tests and
  publishing.
- Build demo as static assets into `.gh-pages/` for GitHub Pages publishing.


## [4.1.0] - 2021-12-10
### Changed
- Bumped `pica` to v9.0.0.


## [4.0.0] - 2021-12-08
### Changed
- Bumped `pica` to v8.0.0.


## [3.0.1] - 2021-06-17
### Changed
- Bumped `pica` to v7.1.0.

### Fixed
- Return error when canvas data read blocked by fingerprint protection, #28.


## [3.0.0] - 2021-05-23
### Changed
- Bumped `pica` to v7.0.0. See pica docs for unsharp mask & options change.


## [2.2.3] - 2021-04-19
### Fixed
- Original Exif is now appended to resized JPEG image, #26.


## [2.2.2] - 2021-01-15
### Fixed
- Fix minified build.


## [2.2.1] - 2020-12-30
### Added
- Add lib/image-traverse to package.json exports.


## [2.2.0] - 2020-12-18
### Added
- Exports package.json, needed for react-native and some bundlers, #19.


## [2.1.1] - 2020-11-17
### Fixed
- Rename module build .js => .mjs to fix node import.


## [2.1.0] - 2020-11-12
### Added
- Added es6 modules support, #16.


## [2.0.0] - 2020-10-15
### Added
- Added separate `._calculate_size()` to simplify logic override.

### Changed
- Drop deprecated `.to_blob()` & `to_canvas()` (use `.toBlob()` & `toCanvas()`
  instead).
- browserify => rollup.js.
- Global name in browser changed to `window.ImageBlobReduce`.


## [1.0.7] - 2020-08-20
### Fixed
- Added Safari canvas GC workaround, https://github.com/nodeca/pica/issues/199.


## [1.0.6] - 2020-07-31
### Fixed
- jpeg plugin should create canvas via `pica`.


## [1.0.5] - 2020-07-26
### Added
- Added `.use()` method.

### Fixed
- Check output blob type before transfer EXIF header.


## [1.0.4] - 2020-07-14
### Fixed
- Fixed public method names. Should be `.toCanvas()` and `.toBlob()`, as in doc.
  Old names are left as aliases until 2.0 and will be removed.


## [1.0.3] - 2020-07-11
### Changed
- Create canvas via pica helper.
- Rearrange utilities to simplify modifications.


## [1.0.2] - 2020-07-11
### Added
- Added `pica` options support (`alpha`, `unsharpAmount`, `unsharpRadius`,
  `unsharpThreshold`, `cancelToken`).

### Changed
- `pica` version bump.


## [1.0.1] - 2020-06-25
### Added
- Added `pica` to module exports.


## [1.0.0] - 2020-06-25
### Added
- First release.


[Unpublished]: https://github.com/nodeca/image-blob-reduce/compare/4.1.0...HEAD
[4.1.0]: https://github.com/nodeca/image-blob-reduce/compare/4.0.0...4.1.0
[4.0.0]: https://github.com/nodeca/image-blob-reduce/compare/3.0.1...4.0.0
[3.0.1]: https://github.com/nodeca/image-blob-reduce/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/nodeca/image-blob-reduce/compare/2.2.3...3.0.0
[2.2.3]: https://github.com/nodeca/image-blob-reduce/compare/2.2.2...2.2.3
[2.2.2]: https://github.com/nodeca/image-blob-reduce/compare/2.2.1...2.2.2
[2.2.1]: https://github.com/nodeca/image-blob-reduce/compare/2.2.0...2.2.1
[2.2.0]: https://github.com/nodeca/image-blob-reduce/compare/2.1.1...2.2.0
[2.1.1]: https://github.com/nodeca/image-blob-reduce/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/nodeca/image-blob-reduce/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/nodeca/image-blob-reduce/compare/1.0.7...2.0.0
[1.0.7]: https://github.com/nodeca/image-blob-reduce/compare/1.0.6...1.0.7
[1.0.6]: https://github.com/nodeca/image-blob-reduce/compare/1.0.5...1.0.6
[1.0.5]: https://github.com/nodeca/image-blob-reduce/compare/1.0.4...1.0.5
[1.0.4]: https://github.com/nodeca/image-blob-reduce/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/nodeca/image-blob-reduce/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/nodeca/image-blob-reduce/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/nodeca/image-blob-reduce/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/nodeca/image-blob-reduce/releases/tag/1.0.0
