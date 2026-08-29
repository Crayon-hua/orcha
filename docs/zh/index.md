---
layout: home

hero:
  name: Orcha
  text: 面向 Vue 的可视化编排
  tagline: 画布、表单、变量、插件、物料 —— 用来把工作流设计器嵌进你自己的产品。
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/Crayon-hua/orcha
    - theme: alt
      text: 现场演示
      link: /examples/playground

features:
  - title: 画布
    details: Vue Flow 只作画布内核。网格、Controls、MiniMap 由 @ihxy/orcha-vue 默认装配，不必自己装 @vue-flow/*。
  - title: 表单
    details: FormSchema / FormRenderer 驱动属性面板，兼容旧的 fields[]。
  - title: 变量
    details: 设计态上游输出，支持插入 nodeId.output 模板。浏览器里不执行表达式。
  - title: 物料
    details: 内置开始 / 结束 / 任务 / 条件，可用 defineNodeType 扩展。
---
