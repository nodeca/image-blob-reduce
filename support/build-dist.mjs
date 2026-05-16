import { rm } from 'node:fs/promises'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { build } from 'vite'

const banner = '/*!\n\nimage-blob-reduce\nhttps://github.com/nodeca/image-blob-reduce\n\n*/'

const common = {
  configFile: false,
  logLevel: 'info',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2015',
    minify: false,
    rollupOptions: {
      output: { banner }
    }
  }
}

async function buildDts (input, output) {
  const bundle = await rollup({
    input,
    plugins: [dts({ tsconfig: './tsconfig.json' })]
  })

  await bundle.write({ file: output, format: 'es' })
}

async function buildDeclarations () {
  await buildDts('src/index.ts', 'dist/image-blob-reduce.es.d.ts')
  await buildDts('src/index_umd_proxy.ts', 'dist/image-blob-reduce.cjs.d.ts')
}

await rm('dist', { recursive: true, force: true })

await build({
  ...common,
  build: {
    ...common.build,
    lib: {
      entry: 'src/index_umd_proxy.ts',
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
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'image-blob-reduce.mjs'
    }
  }
})

await buildDeclarations()
