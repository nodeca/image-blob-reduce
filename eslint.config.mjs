import neostandard from 'neostandard'
import globals from 'globals'

export default [
  ...neostandard({
    env: ['browser', 'node'],
    ignores: [
      'demo/**',
      'dist/**',
      'support/rollup.config.js'
    ]
  }),

  {
    rules: {
      camelcase: 'off',
      'one-var': 'off',
    }
  },

  {
    files: ['test/**'],
    languageOptions: {
      ecmaVersion: 2018,
      globals: globals.mocha
    }
  }
]
