import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@ihxy/orcha-core': resolve(root, '../core/src/index.ts'),
      '@ihxy/orcha-vue': resolve(root, '../vue/src/index.ts'),
      '@ihxy/orcha-plugins': resolve(root, '../plugins/src/index.ts'),
    },
  },
})
