import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

function vueFlow(name: string): string {
  return resolve(root, `../packages/vue/node_modules/@vue-flow/${name}`)
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ihxy/orcha-editor': resolve(root, '../packages/editor/src/index.ts'),
      '@ihxy/orcha-vue': resolve(root, '../packages/vue/src/index.ts'),
      '@ihxy/orcha-core': resolve(root, '../packages/core/src/index.ts'),
      '@ihxy/orcha-form': resolve(root, '../packages/form/src/index.ts'),
      '@ihxy/orcha-variable': resolve(root, '../packages/variable/src/index.ts'),
      '@ihxy/orcha-plugins': resolve(root, '../packages/plugins/src/index.ts'),
      '@ihxy/orcha-materials': resolve(root, '../packages/materials/src/index.ts'),
      '@vue-flow/core': vueFlow('core'),
      '@vue-flow/background': vueFlow('background'),
      '@vue-flow/controls': vueFlow('controls'),
      '@vue-flow/minimap': vueFlow('minimap'),
    },
    dedupe: ['vue', '@vue-flow/core'],
  },
  optimizeDeps: {
    include: ['@vue-flow/core', '@vue-flow/background', '@vue-flow/controls', '@vue-flow/minimap'],
  },
  server: {
    port: 5200,
    strictPort: true,
    fs: {
      allow: [resolve(root, '..')],
    },
  },
})
