# Orcha

**Orcha** — An extensible visual orchestration framework for Vue.

基于 [Vue Flow](https://vueflow.dev/) 的可视化编排：画布内核在 `@ihxy/orcha-vue`，节点契约、表单、设计态变量与插件分层。JSON 解析与节点 IO 校验在 `@ihxy/orcha-core`。

```bash
pnpm add @ihxy/orcha-editor vue
```

宿主需要 **Vue 3.3+**。不要自己装 `@vue-flow/*`。

```vue
<template>
  <WorkflowDesigner v-model="workflow" style="height: 640px" />
</template>

<script setup>
import { WorkflowDesigner, createEmptyWorkflow } from '@ihxy/orcha-editor'
import { ref } from 'vue'

const workflow = ref(createEmptyWorkflow('我的流程'))
</script>
```

完整交互请在仓库里跑 `pnpm dev`（playground），或看 [现场演示](/demo)。

## License

Apache-2.0。
