import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

const browser = {
  enabled: true,
  provider: playwright(),
  headless: true,
  instances: [
    { browser: 'chromium' }
  ]
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['test/unit/**/*.test.ts']
        }
      },
      {
        test: {
          name: 'browser',
          include: ['test/browser/**/*.test.ts'],
          browser
        }
      },
      {
        test: {
          name: 'dist',
          include: ['test/dist/**/*.test.ts'],
          browser
        }
      },
      {
        test: {
          name: 'package',
          environment: 'node',
          include: ['test/package/**/*.test.ts']
        }
      }
    ]
  }
})
