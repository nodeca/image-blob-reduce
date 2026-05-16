import neostandard from 'neostandard'

export default [
  ...neostandard({
    env: ['browser', 'node'],
    ts: true,
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
      '@typescript-eslint/no-explicit-any': 'off',
    }
  },
]
