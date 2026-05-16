import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rm } from 'node:fs/promises'
import { build } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const banner = '/*!\n\nimage-blob-reduce\nhttps://github.com/nodeca/image-blob-reduce\n\n*/'

const common = {
  configFile: false,
  logLevel: 'info',
  build: {
    outDir: path.resolve(root, 'dist'),
    emptyOutDir: false,
    target: 'es2015',
    minify: false,
    rollupOptions: {
      output: { banner }
    }
  }
}

await rm(path.resolve(root, 'dist'), { recursive: true, force: true })

await build({
  ...common,
  build: {
    ...common.build,
    lib: {
      entry: path.resolve(root, 'src/index_umd_proxy.ts'),
      name: 'imageBlobReduce',
      formats: ['umd'],
      fileName: () => 'image-blob-reduce.js'
    },
    rollupOptions: {
      output: {
        banner,
        exports: 'default',
        name: 'imageBlobReduce'
      }
    }
  }
})

await build({
  ...common,
  build: {
    ...common.build,
    lib: {
      entry: path.resolve(root, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'image-blob-reduce.mjs'
    }
  }
})
