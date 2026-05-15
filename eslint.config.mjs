import neostandard from 'neostandard'
import globals from 'globals'

export default [
  ...neostandard({
    env: ['browser', 'node'],
    ignores: [
      'demo/**',
      'dist/**',
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
      globals: globals.mocha
    }
  }
]
