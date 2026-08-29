import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const root = dirname(fileURLToPath(import.meta.url))

function vueFlow(name: string): string {
  return resolve(root, `../../packages/vue/node_modules/@vue-flow/${name}`)
}

const github = 'https://github.com/Crayon-hua/orcha'

const enNav = [
  { text: 'Guide', link: '/en/guide/getting-started' },
  { text: 'Materials', link: '/en/materials/introduction' },
  { text: 'Examples', link: '/en/examples/playground' },
  { text: 'API', link: '/en/api/' },
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
        { text: 'Introduction', link: '/en/guide/getting-started' },
        { text: 'Editor', link: '/en/guide/editor' },
      ],
    },
    {
      text: 'Engine',
      items: [
        { text: 'Canvas', link: '/en/guide/canvas' },
        { text: 'Form', link: '/en/guide/form' },
        { text: 'Variable', link: '/en/guide/variable' },
        { text: 'Plugins', link: '/en/guide/plugins' },
      ],
    },
  ],
  '/materials/': [
    {
      text: 'Materials',
      items: [
        { text: 'Introduction', link: '/en/materials/introduction' },
      ],
    },
  ],
  '/examples/': [
    {
      text: 'Examples',
      items: [
        { text: 'Playground', link: '/en/examples/playground' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'API',
      items: [
        { text: 'Packages', link: '/en/api/' },
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
  description: '面向 Vue 的可扩展可视化编排框架。',
  lang: 'zh-CN',
  base: '/orcha/',
  lastUpdated: true,
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '面向 Vue 的可扩展可视化编排框架。',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        outline: { label: '本页目录', level: 'deep' },
        lastUpdated: { text: '最后更新于' },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言',
        socialLinks: [{ icon: 'github', link: github }],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      description: 'An extensible visual orchestration framework for Vue.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        outline: 'deep',
        socialLinks: [{ icon: 'github', link: github }],
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', link: github }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '输入',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },
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
      include: [
        '@vue-flow/core',
        '@vue-flow/background',
        '@vue-flow/controls',
        '@vue-flow/minimap',
        'three',
      ],
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
