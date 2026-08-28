# 安装与用法

## 安装

```bash
pnpm add smart-workflow-designer vue @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap
```

`vue` 与 `@vue-flow/*` 必须由宿主安装。库内部不打包它们，否则 Vue Flow 的 `provide/inject` 会失效。

## 能力

| 能力 | 说明 |
| :--- | :--- |
| 画布 | Vue Flow + 网格背景、Controls、MiniMap |
| 节点 | 内置开始 / 结束 / 任务 / 条件，可用 `defineNodeType` 扩展 |
| 编辑 | 拖拽上布、连线校验、属性面板、撤销重做 |
| 数据 | `v-model` 绑定 `WorkflowDefinition` JSON，导入导出 |

## 用法

```vue
<template>
  <WorkflowDesigner v-model="workflow" style="height: 640px" />
</template>

<script setup lang="ts">
import { WorkflowDesigner, createEmptyWorkflow } from 'smart-workflow-designer'
import { ref } from 'vue'

const workflow = ref(createEmptyWorkflow('我的流程'))
</script>
```

组件会自行注入样式。也可以显式：

```ts
import 'smart-workflow-designer/style.css'
```

## Props

| Prop | 类型 | 说明 |
|---|---|---|
| `modelValue` / `v-model` | `WorkflowDefinition` | 工作流 JSON |
| `nodeTypes` | `NodeTypeDefinition[]` | 追加自定义节点 |
| `readonly` / `v-model:readonly` | `boolean` | 只读模式 |
| `flowId` | `string` | 可选，多实例时区分 Vue Flow store |

## 自定义节点

```ts
import { defineNodeType } from 'smart-workflow-designer'

const extraTypes = [
  defineNodeType({
    type: 'approval',
    label: '审批',
    component: ApprovalNode,
    palette: { group: '扩展', description: '自定义节点示例' },
    fields: [
      { key: 'label', label: '名称', type: 'text' },
      { key: 'approver', label: '审批人', type: 'text' },
    ],
    handles: { target: true, source: true },
    defaultData: { label: '审批', approver: '' },
  }),
]
```

```vue
<WorkflowDesigner v-model="workflow" :node-types="extraTypes" />
```

自定义节点组件里用 `@vue-flow/core` 的 `Handle`。注册时 `defineNodeType` 会 `markRaw`，避免被做成响应式。

## 数据契约

`v-model` 使用稳定的工作流 JSON，而不是 Vue Flow 内部 Node：

```ts
interface WorkflowDefinition {
  version: '1.0'
  id?: string
  name?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  viewport?: { x: number; y: number; zoom: number }
}
```

`parseWorkflow` / `serializeWorkflow` 会校验 version、id 唯一、边的 source/target 存在。

## 连线规则

- `start`：仅出口
- `end`：仅入口
- `task`：一进一出
- `condition`：一进，两个出口 handle（`true` / `false`）

## 服务端渲染

本组件只能在浏览器里运行。如果项目会先在服务端出 HTML（例如 Nuxt），请把组件包在 `ClientOnly` 里。
