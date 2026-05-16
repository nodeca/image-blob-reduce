import neostandard from 'neostandard'

export default [
  ...neostandard({
    env: ['browser', 'node'],
    ignores: [
      '.gh-pages/**',
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
]
