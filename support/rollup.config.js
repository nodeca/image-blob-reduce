import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from '../package.json';
import { terser } from 'rollup-plugin-terser';


const banner = {
  banner() {
    return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`;
  }
}

const umd_out_base = { format: 'umd', name: 'ImageBlobReduce'/*, exports: 'named'*/ };


export default {
  input: 'index.js',
  output: [
    { ...umd_out_base, file: 'dist/image-blob-reduce.js' },
    { ...umd_out_base, file: 'dist/image-blob-reduce.min.js', plugins: [ terser({
      compress: { evaluate: false },
    }) ] },
    {
      file: 'dist/image-blob-reduce.esm.mjs',
      format: 'esm'
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    banner
  ]
};
