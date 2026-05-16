import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const requireFromHere = createRequire(import.meta.url)
const pkg = requireFromHere('./package.json')

const banner = `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2015',
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/index_umd_proxy.mjs'),
      name: 'imageBlobReduce',
      formats: ['umd'],
      fileName: () => 'image-blob-reduce.js'
    },
    rollupOptions: {
      output: { banner }
    }
  }
})
