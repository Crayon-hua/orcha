import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const root = dirname(fileURLToPath(import.meta.url))

function vueFlow(name: string): string {
  return resolve(root, `../../packages/vue/node_modules/@vue-flow/${name}`)
}

const github = 'https://github.com/Crayon-hua/orcha'

const enNav = [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'Materials', link: '/materials/introduction' },
  { text: 'Examples', link: '/examples/playground' },
  { text: 'API', link: '/api/' },
]

const zhNav = [
  { text: '指引', link: '/guide/getting-started' },
  { text: '物料', link: '/materials/introduction' },
  { text: '例子', link: '/examples/playground' },
  { text: 'API', link: '/api/' },
]

const enSidebar = {
  '/guide/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/guide/getting-started' },
        { text: 'Editor', link: '/guide/editor' },
      ],
    },
    {
      text: 'Engine',
      items: [
        { text: 'Canvas', link: '/guide/canvas' },
        { text: 'Form', link: '/guide/form' },
        { text: 'Variable', link: '/guide/variable' },
        { text: 'Plugins', link: '/guide/plugins' },
      ],
    },
  ],
  '/materials/': [
    {
      text: 'Materials',
      items: [
        { text: 'Introduction', link: '/materials/introduction' },
      ],
    },
  ],
  '/examples/': [
    {
      text: 'Examples',
      items: [
        { text: 'Playground', link: '/examples/playground' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'API',
      items: [
        { text: 'Packages', link: '/api/' },
      ],
    },
  ],
}

const zhSidebar = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '快速上手', link: '/guide/getting-started' },
        { text: '编辑器', link: '/guide/editor' },
      ],
    },
    {
      text: '引擎',
      items: [
        { text: '画布', link: '/guide/canvas' },
        { text: '表单', link: '/guide/form' },
        { text: '变量', link: '/guide/variable' },
        { text: '插件', link: '/guide/plugins' },
      ],
    },
  ],
  '/materials/': [
    {
      text: '物料',
      items: [
        { text: '简介', link: '/materials/introduction' },
      ],
    },
  ],
  '/examples/': [
    {
      text: '例子',
      items: [
        { text: 'Playground', link: '/examples/playground' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'API',
      items: [
        { text: '包一览', link: '/api/' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'Orcha',
  description: 'An extensible visual orchestration framework for Vue.',
  base: '/orcha/',
  lastUpdated: true,
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description: 'An extensible visual orchestration framework for Vue.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        outline: 'deep',
        socialLinks: [{ icon: 'github', link: github }],
        search: { provider: 'local' },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '面向 Vue 的可扩展可视化编排框架。',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        outline: 'deep',
        socialLinks: [{ icon: 'github', link: github }],
        search: { provider: 'local' },
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', link: github }],
    search: { provider: 'local' },
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
