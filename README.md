# Orcha

**Orcha** — An extensible visual orchestration framework for Vue.

本仓库是 pnpm workspace：可发布的库在 `packages/` 下七个 `@ihxy/orcha-*` 包，playground 与 VitePress 文档站各自独立成包。

## 安装

完整编辑器：

```bash
pnpm add @ihxy/orcha-editor vue
```

`vue` 是唯一 peer。不要自己装 `@vue-flow/*`（由 `@ihxy/orcha-vue` 带上）。只解析 / 校验工作流 JSON、不需要画布时，可单独安装 `@ihxy/orcha-core`。

## 用法

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

组件会自行注入样式。也可以显式引入 `@ihxy/orcha-editor/style.css`。

自定义节点的锚点从 `@ihxy/orcha-vue` 引入，不要从 `@vue-flow/core` 引：

```ts
import { defineNodeType } from '@ihxy/orcha-editor'
import { Handle, Position } from '@ihxy/orcha-vue'

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

## 包

| 包 | 职责 |
| :--- | :--- |
| `@ihxy/orcha-core` | Document、JSON 1.0、catalog、命令栈；无 Vue |
| `@ihxy/orcha-vue` | 画布适配、节点注册；再导出 Vue Flow API |
| `@ihxy/orcha-form` | FormSchema / FormRenderer |
| `@ihxy/orcha-variable` | 设计态上游输出与 `{{ }}` |
| `@ihxy/orcha-plugins` | 插件生命周期、撤销重做、复制粘贴、快捷键 |
| `@ihxy/orcha-materials` | start / end / task / condition |
| `@ihxy/orcha-editor` | 面板拼装，依赖上面 6 个包 |

## 本地开发

```bash
pnpm install
pnpm dev          # playground
pnpm docs:dev     # VitePress 文档站
pnpm build        # 按依赖序构建七个包
pnpm test         # core 契约单测 + materials 物料校验
pnpm lint:all
```

playground 默认 `http://localhost:5200/`，文档站 `pnpm docs:dev` 默认 `http://localhost:5300/`。

## 发版

- **CI**：PR 和推 `main` 时跑 lint / type-check / test / build
- **文档站**：推 `main` 时由 GitHub Pages workflow 部署
- **npm**：只在推 `v*` tag 时按依赖序发布七个 `@ihxy/orcha-*` 包

在 `main` 上把七个包的 `version` 改成同一目标版本（以 `packages/editor/package.json` 为准）并提交，然后：

```bash
git tag v0.1.0
git push origin v0.1.0
```

tag 必须与包版本一致（`v0.1.0` → `0.1.0`）。

第一次发 `0.1.0` 必须本机 `publish --access public`（Trusted Publisher 不能创建新包）。仓库根目录：

```bash
pnpm publish:only
```

之后在 npm 为每个包绑定同一套 GitHub Trusted Publisher：

- Repository：`Crayon-hua/orcha`
- Workflow：`publish.yml`
- Environment：`npm`

后续发版只推 `v*` tag，由 GitHub Actions 自动发布。

## License

Apache-2.0。
