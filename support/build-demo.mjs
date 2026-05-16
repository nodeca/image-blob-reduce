import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

await build({
  configFile: false,
  root: path.resolve(root, 'demo'),
  base: './',
  logLevel: 'info',
  build: {
    outDir: path.resolve(root, '.gh-pages'),
    emptyOutDir: true
  }
})
