# 安装与用法

## 安装

```bash
pnpm add @ihxy/smart-workflow-designer vue @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap
```

`vue` 与 `@vue-flow/*` 必须由宿主安装。库内部不打包它们，否则 Vue Flow 的 `provide/inject` 会失效。只做 JSON 解析 / 校验时可单独安装 `@ihxy/workflow-core`。

## 能力

| 能力 | 说明 |
| :--- | :--- |
| 画布 | Vue Flow 仅作画布内核：网格、Controls、MiniMap |
| 节点 | 内置开始 / 结束 / 任务 / 条件，可用 `defineNodeType` 扩展（form / ports / inputs / outputs） |
| 表单 | `FormSchema` 驱动属性面板，兼容旧 `fields[]` |
| 变量 | 设计态上游输出可见，支持插入 `{{ nodeId.output }}` |
| 编辑 | 拖拽上布、连线校验、命令式撤销重做、复制粘贴 |
| 数据 | `v-model` 绑定可版本化 `WorkflowDefinition` JSON，导入导出 |

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

组件会自行注入样式。也可以显式：

```ts
import '@ihxy/smart-workflow-designer/style.css'
```

## Props

| Prop | 类型 | 说明 |
|---|---|---|
| `modelValue` / `v-model` | `WorkflowDefinition` | 工作流 JSON |
| `nodeTypes` | `NodeTypeDefinition[]` | 追加自定义节点 |
| `readonly` / `v-model:readonly` | `boolean` | 只读模式 |
| `flowId` | `string` | 可选，多实例时区分 Vue Flow store |

## 自定义节点

推荐用 `form` / `ports` / `inputs` / `outputs`。旧的 `fields`、`handles` 仍可用，会在注册时自动提升。

```ts
import { defineNodeType } from '@ihxy/smart-workflow-designer'

const extraTypes = [
  defineNodeType({
    type: 'approval',
    label: '审批',
    component: ApprovalNode,
    palette: { group: '扩展', description: '自定义节点示例' },
    form: {
      fields: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'approver', label: '审批人', type: 'text' },
      ],
    },
    ports: { target: true, source: true },
    inputs: [{ name: 'input', type: 'any' }],
    outputs: [{ name: 'result', type: 'object' }],
    defaultData: { label: '审批', approver: '' },
  }),
]
```

```vue
<WorkflowDesigner v-model="workflow" :node-types="extraTypes" />
```

自定义节点组件里用 `@vue-flow/core` 的 `Handle`。注册时 `defineNodeType` 会 `markRaw`，避免被做成响应式。

## 数据契约

`v-model` 使用稳定的工作流 JSON，而不是 Vue Flow 内部 Node。当前版本是 `1.0`，由 `SUPPORTED_WORKFLOW_VERSIONS` 管理；Go 运行时只消费这份 JSON 与节点 IO 契约，不要在浏览器里执行节点。

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

`parseWorkflow` / `serializeWorkflow` 会校验 version、id 唯一、边的 source/target 存在。交给后端前用 `toRuntimePayload(workflow, catalog)`，需同时传入节点目录。无 Vue 时直接从 `@ihxy/workflow-core` 引用这些 API。

## 连线规则

- `start`：仅出口
- `end`：仅入口
- `task`：一进一出
- `condition`：一进，两个出口 port（`true` / `false`，标签来自节点契约）

快捷键：`Ctrl/Cmd+Z` 撤销，`Shift+Ctrl/Cmd+Z` 或 `Ctrl+Y` 重做，`Ctrl+C` / `Ctrl+V` 复制粘贴，`Delete` 删除选中。

## 运行时契约

设计器产出**两份** JSON，不要把节点 IO 塞进实例里的 `data`：

| 文件 | 版本字段 | 职责 |
| :--- | :--- | :--- |
| 流程实例 `workflow.json` | `version: "1.0"` | 节点、边、`data`、表达式 |
| 节点目录 `node-catalog.json` | `catalogVersion: "1.0"` | 每种 `type` 的 `ports` / `inputs` / `outputs` |

Schema 与金样例在 [`@ihxy/workflow-core`](https://www.npmjs.com/package/@ihxy/workflow-core) 的 [`packages/core/contracts/`](../packages/core/contracts/)。

**运行时必填：** `version`、`nodes[].id|type|data`、`edges[].id|source|target`（以及可选 handle）。

**运行时忽略：** `position`、`viewport`、边 `label`、Vue 组件、表单控件、palette。

表达式只认一层 `{{ nodeId.outputName }}`（两侧空白可有）。`nodeId` 必须是拓扑上游，`outputName` 必须出现在该节点类型的 `outputs` 里。

```ts
import {
  parseNodeCatalog,
  parseWorkflow,
  toRuntimePayload,
  validateWorkflowAgainstCatalog,
} from '@ihxy/workflow-core'
import { builtinNodeCatalog } from '@ihxy/smart-workflow-designer'

const workflow = parseWorkflow(json)
validateWorkflowAgainstCatalog(workflow, builtinNodeCatalog)
const payload = toRuntimePayload(workflow, builtinNodeCatalog)
```

设计器仍再导出这些 API，现有 `from '@ihxy/smart-workflow-designer'` 不必立刻改。导出 JSON **暂不强制内嵌 catalog**。Go 执行器另开任务，读同一套 Schema。

### 定稿标准

- 实例与 catalog 的 Schema + 正反 fixture 在 CI 中跑通
- 内置 start / end / task / condition 的 IO/ports 都在 catalog 里
- `toRuntimePayload` 输出能通过 schema
- 表达式覆盖：合法引用、未知节点、未知 output

## 服务端渲染

本组件只能在浏览器里运行。如果项目会先在服务端出 HTML（例如 Nuxt），请把组件包在 `ClientOnly` 里。
