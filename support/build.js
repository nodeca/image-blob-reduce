#!/usr/bin/env node

'use strict'

const path = require('node:path')
const { createRequire } = require('node:module')

const requireFromHere = createRequire(__filename)
const pkg = requireFromHere('../package.json')

const banner = `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`

function buildConfig ({ format, fileName, minify = false, name }) {
  return {
    configFile: false,
    build: {
      outDir: 'dist',
      emptyOutDir: fileName === 'image-blob-reduce.js',
      minify,
      terserOptions: {
        compress: { evaluate: false }
      },
      lib: {
        entry: path.resolve('lib/index.js'),
        name,
        formats: [format],
        fileName: () => fileName
      },
      rollupOptions: {
        output: { banner }
      }
    }
  }
}

async function main () {
  const { build } = await import('vite')

  await build(buildConfig({
    format: 'umd',
    fileName: 'image-blob-reduce.js',
    name: 'ImageBlobReduce'
  }))

  await build(buildConfig({
    format: 'umd',
    fileName: 'image-blob-reduce.min.js',
    minify: 'terser',
    name: 'ImageBlobReduce'
  }))

  await build(buildConfig({
    format: 'es',
    fileName: 'image-blob-reduce.esm.mjs'
  }))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
