# @ihxy/smart-workflow-designer

基于 [Vue Flow](https://vueflow.dev/) 的 Vue 3 工作流设计器：画布、节点面板、属性面板、JSON 导入导出。可发布到 npm，给其他 Vue 3 项目直接使用。

```bash
pnpm add @ihxy/smart-workflow-designer vue @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap
```

宿主需要 **Vue 3.3+**，并且自行安装 `@vue-flow/*`（peerDependencies），避免出现双实例。

```vue
<template>
  <WorkflowDesigner v-model="workflow" style="height: 640px" />
</template>

<script setup>
import { WorkflowDesigner, createEmptyWorkflow } from '@ihxy/smart-workflow-designer'
import { ref } from 'vue'

const workflow = ref(createEmptyWorkflow('我的流程'))
</script>
```

完整交互请在仓库里跑 `pnpm dev`（playground），或看 [现场演示](/demo)。

## License

Apache-2.0。
