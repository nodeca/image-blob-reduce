import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'support/demo_template/index.js',
  output: {
    file: 'demo/index.js',
    format: 'iife',
    name: 'demo'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};
