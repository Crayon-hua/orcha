import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'smart-workflow-designer': resolve(root, '../packages/designer/src/index.ts'),
    },
    dedupe: ['vue', '@vue-flow/core'],
  },
  server: {
    port: 5200,
    strictPort: true,
    fs: {
      allow: [resolve(root, '..')],
    },
  },
})
