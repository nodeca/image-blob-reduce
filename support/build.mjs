#!/usr/bin/env node

import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const requireFromHere = createRequire(import.meta.url)
const pkg = requireFromHere('../package.json')

const banner = `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`

function buildConfig ({ format, fileName, minify = false, name }) {
  return {
    configFile: false,
    build: {
      outDir: 'dist',
      emptyOutDir: fileName === 'image-blob-reduce.js',
      target: 'es2015',
      minify,
      terserOptions: {
        compress: { evaluate: false }
      },
      lib: {
        entry: path.resolve(__dirname, '../lib/index_umd_proxy.mjs'),
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
    name: 'imageBlobReduce'
  }))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
