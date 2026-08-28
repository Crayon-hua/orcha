import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: '@ihxy/smart-workflow-designer',
  description: 'Vue 3 工作流设计器，基于 Vue Flow：画布、节点面板、属性面板、JSON 导入导出。',
  lang: 'zh-CN',
  base: '/smart-workflow-ui/',
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
      { icon: 'github', link: 'https://github.com/Crayon-hua/smart-workflow-ui' },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@ihxy/smart-workflow-designer': resolve(root, '../../packages/designer/src/index.ts'),
      },
      dedupe: ['vue', '@vue-flow/core'],
    },
    server: {
      port: 5300,
      fs: {
        allow: [resolve(root, '../..')],
      },
    },
    ssr: {
      noExternal: ['@ihxy/smart-workflow-designer', '@vue-flow/core', '@vue-flow/background', '@vue-flow/controls', '@vue-flow/minimap'],
    },
  },
})
