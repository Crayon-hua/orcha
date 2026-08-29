import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const root = dirname(fileURLToPath(import.meta.url))

function vueFlow(name: string): string {
  return resolve(root, `../../packages/vue/node_modules/@vue-flow/${name}`)
}

export default defineConfig({
  title: 'Orcha',
  description: 'An extensible visual orchestration framework for Vue.',
  lang: 'zh-CN',
  base: '/orcha/',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide' },
      { text: '演示', link: '/demo' },
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '简介', link: '/' },
          { text: '安装与用法', link: '/guide' },
          { text: '现场演示', link: '/demo' },
        ],
      },
    ],
    outline: 'deep',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Crayon-hua/orcha' },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@ihxy/orcha-editor': resolve(root, '../../packages/editor/src/index.ts'),
        '@ihxy/orcha-vue': resolve(root, '../../packages/vue/src/index.ts'),
        '@ihxy/orcha-core': resolve(root, '../../packages/core/src/index.ts'),
        '@ihxy/orcha-form': resolve(root, '../../packages/form/src/index.ts'),
        '@ihxy/orcha-variable': resolve(root, '../../packages/variable/src/index.ts'),
        '@ihxy/orcha-plugins': resolve(root, '../../packages/plugins/src/index.ts'),
        '@ihxy/orcha-materials': resolve(root, '../../packages/materials/src/index.ts'),
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
      port: 5300,
      fs: {
        allow: [resolve(root, '../..')],
      },
    },
    ssr: {
      noExternal: [
        '@ihxy/orcha-editor',
        '@ihxy/orcha-vue',
        '@ihxy/orcha-core',
        '@ihxy/orcha-form',
        '@ihxy/orcha-variable',
        '@ihxy/orcha-plugins',
        '@ihxy/orcha-materials',
        '@vue-flow/core',
        '@vue-flow/background',
        '@vue-flow/controls',
        '@vue-flow/minimap',
      ],
    },
  },
})
