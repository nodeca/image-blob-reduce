import { createRequire } from 'node:module'
import { rm } from 'node:fs/promises'
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts'
import { build } from 'vite'

const pkg = createRequire(import.meta.url)('../package.json')

const banner = '/*!\n\nimage-blob-reduce\nhttps://github.com/nodeca/image-blob-reduce\n\n*/'
const external = Object.keys(pkg.dependencies ?? {})

const common = {
  configFile: false,
  logLevel: 'info',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true
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
  await buildDts('src/index_cjs_proxy_types.ts', 'dist/image-blob-reduce.cjs.d.ts')
}

await rm('dist', { recursive: true, force: true })

await build({
  ...common,
  build: {
    ...common.build,
    target: 'es2015',
    lib: {
      entry: 'src/index_cjs_proxy.ts',
      name: 'imageBlobReduce',
      formats: ['cjs'],
      fileName: () => 'image-blob-reduce.js'
    },
    rollupOptions: {
      external,
      output: {
        banner,
        exports: 'default'
      }
    }
  }
})

await build({
  ...common,
  build: {
    ...common.build,
    target: 'es2022',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'image-blob-reduce.mjs'
    },
    rollupOptions: {
      external,
      output: { banner }
    }
  }
})

await build({
  ...common,
  build: {
    ...common.build,
    target: 'es2015',
    minify: true,
    lib: {
      entry: 'src/index_cjs_proxy.ts',
      name: 'imageBlobReduce',
      formats: ['umd'],
      fileName: () => 'image-blob-reduce.browser.min.js'
    },
    rollupOptions: {
      external: [],
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
    target: 'es2017',
    minify: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'image-blob-reduce.browser.min.mjs'
    },
    rollupOptions: {
      external: [],
      output: { banner }
    }
  }
})

await buildDeclarations()
