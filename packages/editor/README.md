# @ihxy/orcha-editor

Orcha — visual workflow editor for Vue: palette, canvas, property panel, toolbar.

```bash
pnpm add @ihxy/orcha-editor vue
```

`vue` is the only peer. Vue Flow is pulled in by `@ihxy/orcha-vue`; do not install `@vue-flow/*` unless your app already has another Vue Flow canvas.

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

Custom node handles:

```ts
import { Handle, Position } from '@ihxy/orcha-vue'
```

## License

Apache-2.0.
