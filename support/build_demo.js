#!/usr/bin/env node

'use strict'

const fs = require('node:fs')
const path = require('node:path')

async function main () {
  const { build } = await import('vite')

  fs.rmSync('demo', { recursive: true, force: true })
  fs.mkdirSync('demo')

  fs.copyFileSync('dist/image-blob-reduce.min.js', 'demo/image-blob-reduce.js')
  fs.copyFileSync('support/demo_template/index.html', 'demo/index.html')

  await build({
    configFile: false,
    build: {
      outDir: 'demo',
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: path.resolve('support/demo_template/index.js'),
        name: 'demo',
        formats: ['iife'],
        fileName: () => 'index.js'
      }
    }
  })
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
