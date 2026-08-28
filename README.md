# @ihxy/smart-workflow-designer

基于 [Vue Flow](https://vueflow.dev/) 的 Vue 3 工作流设计器：画布、节点面板、属性面板、JSON 导入导出。

本仓库是 pnpm workspace：可发布的库在 `packages/core`（`@ihxy/workflow-core`）与 `packages/designer`（`@ihxy/smart-workflow-designer`），playground 与 VitePress 文档站各自独立成包。

## 安装

```bash
pnpm add @ihxy/smart-workflow-designer vue @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap
```

只解析 / 校验工作流 JSON、不需要画布时，可单独安装 `@ihxy/workflow-core`。

`vue` 与 `@vue-flow/*` 是 peerDependencies，必须由宿主安装，避免 Vue Flow 双实例。

## 用法

```vue
<template>
  <WorkflowDesigner v-model="workflow" style="height: 640px" />
</template>

<script setup lang="ts">
import { WorkflowDesigner, createEmptyWorkflow } from '@ihxy/smart-workflow-designer'
import { ref } from 'vue'

const workflow = ref(createEmptyWorkflow('我的流程'))
</script>
```

组件会自行注入样式。也可以显式引入 `@ihxy/smart-workflow-designer/style.css`。

自定义节点：

```ts
import { defineNodeType } from '@ihxy/smart-workflow-designer'

const extraTypes = [
  defineNodeType({
    type: 'approval',
    label: '审批',
    component: ApprovalNode,
    palette: { group: '扩展' },
    fields: [{ key: 'label', label: '名称', type: 'text' }],
    handles: { target: true, source: true },
    defaultData: { label: '审批' },
  }),
]
```

```vue
<WorkflowDesigner v-model="workflow" :node-types="extraTypes" />
```

## 本地开发

本仓库是 pnpm workspace：

```bash
pnpm install
pnpm dev          # playground 设计器 Demo
pnpm docs:dev     # VitePress 文档站
pnpm build        # 构建 @ihxy/workflow-core 与 @ihxy/smart-workflow-designer
pnpm test         # core 契约单测 + designer 物料校验
pnpm lint:all
```

playground 默认 `http://localhost:5200/`，文档站 `pnpm docs:dev` 默认 `http://localhost:5300/`。

## 发版

- **CI**：PR 和推 `main` 时跑 lint / type-check / build
- **文档站**：推 `main` 时由 GitHub Pages workflow 部署
- **npm**：只在推 `v*` tag 时发布 `@ihxy/workflow-core` 与 `@ihxy/smart-workflow-designer`（先 core 后 designer）

在 `main` 上把 `packages/designer/package.json` 的 `version` 改成目标版本并提交，然后：

```bash
git tag v0.1.0
git push origin v0.1.0
```

tag 必须与包版本一致（`v0.1.0` → `0.1.0`）。

第一次发 `0.1.0` 可在仓库根目录执行（强制官方源，避开镜像）：

```bash
pnpm publish:only
```

之后在 npm 绑定 Trusted Publisher，后续发版走 tag 即可。

## License

Apache-2.0。
