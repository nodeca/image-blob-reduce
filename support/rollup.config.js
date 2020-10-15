import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from '../package.json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/image-blob-reduce.js',
      format: 'umd',
      name: 'imageBlobReduce'
    },
    {
      file: 'dist/image-blob-reduce.min.js',
      format: 'umd',
      name: 'imageBlobReduce',
      plugins: [ terser() ]
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    {
      banner() {
        return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`;
      }
    }
  ]
};
