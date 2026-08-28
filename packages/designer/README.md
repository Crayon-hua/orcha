# @ihxy/smart-workflow-designer

基于 [Vue Flow](https://vueflow.dev/) 的 Vue 3 工作流设计器。Vue Flow 只负责画布；节点契约、表单、设计态变量、命令历史按层拆分。无 Vue 的 JSON / catalog / 校验在 [`@ihxy/workflow-core`](../core/)。

流程实例与节点 IO 的 JSON Schema、金样例见 [`packages/core/contracts/`](../core/contracts/)。

## 安装

```bash
pnpm add @ihxy/smart-workflow-designer vue @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap
```

`vue` 与 `@vue-flow/*` 是 peerDependencies，必须由宿主安装，避免 Vue Flow 双实例。

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

## License

Apache-2.0。
