# Getting started

Orcha is an extensible visual orchestration framework for Vue: canvas, node forms, design-time variables, plugins, and materials.

## Install

```bash
pnpm add @ihxy/orcha-editor vue
```

`vue` is the only peer the host must install. `@vue-flow/*` is a dependency of `@ihxy/orcha-vue` and is re-exported (`Handle`, `useVueFlow`). The library does not bundle them, so Vue Flow `provide/inject` stays a single instance. For JSON parse/validate only, install `@ihxy/orcha-core`.

If the host already has another Vue Flow canvas, install `@vue-flow/*` in Orcha's `^` range so the package manager can dedupe.

## Usage

```vue
<template>
  <WorkflowDesigner v-model="workflow" style="height: 640px" />
</template>

<script setup lang="ts">
import { WorkflowDesigner, createEmptyWorkflow } from '@ihxy/orcha-editor'
import { ref } from 'vue'

const workflow = ref(createEmptyWorkflow('My flow'))
</script>
```

Styles are injected automatically. You can also import `@ihxy/orcha-editor/style.css`.

## Custom nodes

Prefer `form` / `ports` / `inputs` / `outputs`. Legacy `fields` and `handles` are still lifted at register time.

In custom node components, import `Handle` from `@ihxy/orcha-vue`, not `@vue-flow/core`.

See the [examples](/en/examples/).

## Next

| Page | Topic |
| --- | --- |
| [Editor](/en/guide/editor) | Palette, toolbar, `v-model` |
| [Canvas](/en/guide/canvas) | Vue Flow adapter |
| [Form](/en/guide/form) | Property panel |
| [Variable](/en/guide/variable) | Upstream outputs |
| [Plugins](/en/guide/plugins) | Undo, copy-paste, shortcuts |
| [Materials](/en/materials/introduction) | Built-in node types |
| [API](/en/api/) | Package map |
