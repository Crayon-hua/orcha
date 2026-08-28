# @ihxy/workflow-core

工作流 **JSON 实例** 与 **节点 IO catalog** 的解析、校验与 Document 模型。不依赖 Vue / Vue Flow。

设计器 `@ihxy/smart-workflow-designer` 依赖本包；Go Runtime 也只应消费这里的 Schema 与类型。

## 安装

```bash
pnpm add @ihxy/workflow-core
```

## 两份 JSON

| 文件 | 版本 | 职责 |
|---|---|---|
| `workflow.json` | `version: "1.0"` | 一份流程实例：节点、边、`data`、表达式 |
| `node-catalog.json` | `catalogVersion: "1.0"` | 每种 `type` 的 ports / inputs / outputs |

Schema 与金样例在包内 [`contracts/`](./contracts/)。

```ts
import {
  parseNodeCatalog,
  parseWorkflow,
  toRuntimePayload,
  validateWorkflowAgainstCatalog,
} from '@ihxy/workflow-core'

const workflow = parseWorkflow(instanceJson)
const catalog = parseNodeCatalog(catalogJson)
validateWorkflowAgainstCatalog(workflow, catalog)
const payload = toRuntimePayload(workflow, catalog)
```

`NodeTypeDefinition.component`、表单控件、palette 文案不在本包。那些留在 designer / materials。

## License

Apache-2.0。
