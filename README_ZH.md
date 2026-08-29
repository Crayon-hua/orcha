# Orcha｜面向 Vue 的可视化编排框架

[English](README.md) | [中文](README_ZH.md)

[![License](https://img.shields.io/github/license/Crayon-hua/orcha)](https://github.com/Crayon-hua/orcha/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@ihxy/orcha-editor)](https://www.npmjs.com/package/@ihxy/orcha-editor)
[![npm downloads](https://img.shields.io/npm/dm/@ihxy/orcha-editor)](https://www.npmjs.com/package/@ihxy/orcha-editor)

Orcha 是一个**可扩展的 Vue 可视化编排框架**。
它提供可组合的工具：画布、节点表单、设计态变量、插件与物料，用来把工作流设计器嵌进你自己的产品。这**不是**一套现成的工作流 SaaS。

了解更多：[Orcha 文档 🌐](https://crayon-hua.github.io/orcha/)

## 🎬 演示

本地跑 playground，或打开文档站 [现场演示](https://crayon-hua.github.io/orcha/examples/playground.html)。

```sh
pnpm install
pnpm dev
```

然后打开 [http://localhost:5200](http://localhost:5200)。从左侧拖节点、改属性、撤销重做、导入导出 JSON。

## 🚀 快速上手

1. 安装编辑器。`vue` 是唯一 peer；**不要**自己装 `@vue-flow/*`。

```sh
pnpm add @ihxy/orcha-editor vue
```

2. 挂上设计器：

```vue
<template>
  <WorkflowDesigner v-model="workflow" style="height: 640px" />
</template>

<script setup lang="ts">
import { WorkflowDesigner, createEmptyWorkflow } from '@ihxy/orcha-editor'
import { ref } from 'vue'

const workflow = ref(createEmptyWorkflow('我的流程'))
</script>
```

3. 自定义节点的锚点从 `@ihxy/orcha-vue` 引入，不要从 `@vue-flow/core` 引：

```ts
import { defineNodeType } from '@ihxy/orcha-editor'
import { Handle, Position } from '@ihxy/orcha-vue'
```

只做 JSON 解析 / 校验、不要画布：`pnpm add @ihxy/orcha-core`。

## ✨ 特性

| 特性 | 说明 |
| --- | --- |
| [画布](https://crayon-hua.github.io/orcha/guide/canvas.html) | Vue Flow 仅作画布内核（网格、Controls、MiniMap），由 `@ihxy/orcha-vue` 默认装配。 |
| [表单](https://crayon-hua.github.io/orcha/guide/form.html) | `FormSchema` / `FormRenderer` 驱动属性面板。 |
| [变量](https://crayon-hua.github.io/orcha/guide/variable.html) | 设计态上游输出，支持插入 `{{ nodeId.output }}`。不执行表达式。 |
| [物料](https://crayon-hua.github.io/orcha/materials/introduction.html) | 内置开始 / 结束 / 任务 / 条件，可用 `defineNodeType` 扩展。 |
| [插件](https://crayon-hua.github.io/orcha/guide/plugins.html) | 撤销重做、复制粘贴、快捷键合成一包。 |
| [文档模型](https://crayon-hua.github.io/orcha/guide/getting-started.html) | 可版本化的 `WorkflowDefinition` JSON 1.0 + 节点 IO catalog。运行时消费 JSON，而不是 Vue Flow 内部结构。 |

## 📦 包

| 包 | 职责 |
| --- | --- |
| [`@ihxy/orcha-core`](./packages/core) | Document、JSON 1.0、catalog、命令栈；无 Vue。 |
| [`@ihxy/orcha-vue`](./packages/vue) | 画布适配、节点注册；再导出 Vue Flow API。 |
| [`@ihxy/orcha-form`](./packages/form) | FormSchema / FormRenderer。 |
| [`@ihxy/orcha-variable`](./packages/variable) | 设计态上游输出与 `{{ }}`。 |
| [`@ihxy/orcha-plugins`](./packages/plugins) | 插件生命周期、撤销重做、复制粘贴、快捷键。 |
| [`@ihxy/orcha-materials`](./packages/materials) | start / end / task / condition。 |
| [`@ihxy/orcha-editor`](./packages/editor) | 面板拼装，依赖上面 6 个包。 |

## 📖 文档

完整文档：[https://crayon-hua.github.io/orcha/](https://crayon-hua.github.io/orcha/)

- [简介](https://crayon-hua.github.io/orcha/)
- [安装与用法](https://crayon-hua.github.io/orcha/guide/getting-started.html)
- [现场演示](https://crayon-hua.github.io/orcha/examples/playground.html)

本地文档：`pnpm docs:dev` → [http://localhost:5300](http://localhost:5300)。

## 🛠 本地开发

本仓库是 pnpm workspace。

```sh
pnpm install
pnpm dev          # playground
pnpm docs:dev     # VitePress 文档站
pnpm build
pnpm test
pnpm lint:all
```

## 📬 联系我们

- 问题反馈：[Issues](https://github.com/Crayon-hua/orcha/issues)

## License

[Apache-2.0](./LICENSE)
