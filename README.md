# Orcha｜Visual orchestration framework for Vue

[English](README.md) | [中文](README_ZH.md)

[![License](https://img.shields.io/github/license/Crayon-hua/orcha)](https://github.com/Crayon-hua/orcha/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@ihxy/orcha-editor)](https://www.npmjs.com/package/@ihxy/orcha-editor)
[![npm downloads](https://img.shields.io/npm/dm/@ihxy/orcha-editor)](https://www.npmjs.com/package/@ihxy/orcha-editor)

Orcha is an **extensible visual orchestration framework for Vue**.
It is a composable toolkit—canvas, node forms, design-time variables, plugins, and materials—so you can build a workflow designer into your own product. It is **not** a ready-made workflow SaaS.

Learn more at [Orcha docs 🌐](https://crayon-hua.github.io/orcha/)

## 🎬 Demo

Run the playground locally, or open the [live demo](https://crayon-hua.github.io/orcha/examples/playground.html) on the docs site.

```sh
pnpm install
pnpm dev
```

Then open [http://localhost:5200](http://localhost:5200). Drag nodes from the palette, edit properties, undo/redo, and import/export JSON.

## 🚀 Quick Start

1. Install the editor. `vue` is the only peer; do **not** install `@vue-flow/*` yourself.

```sh
pnpm add @ihxy/orcha-editor vue
```

2. Mount the designer:

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

3. For custom node handles, import from `@ihxy/orcha-vue` (not `@vue-flow/core`):

```ts
import { defineNodeType } from '@ihxy/orcha-editor'
import { Handle, Position } from '@ihxy/orcha-vue'
```

JSON-only parse/validate (no canvas): `pnpm add @ihxy/orcha-core`.

## ✨ Features

| Feature | Description |
| --- | --- |
| [Canvas](https://crayon-hua.github.io/orcha/guide/canvas.html) | Vue Flow as the canvas kernel (grid, Controls, MiniMap), assembled by `@ihxy/orcha-vue`. |
| [Form](https://crayon-hua.github.io/orcha/guide/form.html) | `FormSchema` / `FormRenderer` drive the property panel. |
| [Variable](https://crayon-hua.github.io/orcha/guide/variable.html) | Design-time upstream outputs and `{{ nodeId.output }}` insertion. Does not execute. |
| [Materials](https://crayon-hua.github.io/orcha/materials/introduction.html) | Built-in start / end / task / condition; extend with `defineNodeType`. |
| [Plugins](https://crayon-hua.github.io/orcha/guide/plugins.html) | History, copy-paste, and keyboard shortcuts in one package. |
| [Document](https://crayon-hua.github.io/orcha/guide/getting-started.html) | Versioned `WorkflowDefinition` JSON 1.0 + node IO catalog. Runtime consumes JSON, not Vue Flow internals. |

## 📦 Packages

| Package | Role |
| --- | --- |
| [`@ihxy/orcha-core`](./packages/core) | Document, JSON 1.0, catalog, command stack. No Vue. |
| [`@ihxy/orcha-vue`](./packages/vue) | Canvas adapter, node registry; re-exports Vue Flow APIs. |
| [`@ihxy/orcha-form`](./packages/form) | FormSchema / FormRenderer. |
| [`@ihxy/orcha-variable`](./packages/variable) | Design-time upstream outputs and `{{ }}`. |
| [`@ihxy/orcha-plugins`](./packages/plugins) | Plugin lifecycle, undo/redo, copy-paste, shortcuts. |
| [`@ihxy/orcha-materials`](./packages/materials) | start / end / task / condition. |
| [`@ihxy/orcha-editor`](./packages/editor) | Palette + canvas + panel + toolbar. Depends on the six packages above. |

## 📖 Documentation

Full docs: [https://crayon-hua.github.io/orcha/](https://crayon-hua.github.io/orcha/)

- [Introduction](https://crayon-hua.github.io/orcha/)
- [Install & usage](https://crayon-hua.github.io/orcha/guide/getting-started.html)
- [Live demo](https://crayon-hua.github.io/orcha/examples/playground.html)

Local docs: `pnpm docs:dev` → [http://localhost:5300](http://localhost:5300).

## 🛠 Local development

This repo is a pnpm workspace.

```sh
pnpm install
pnpm dev          # playground
pnpm docs:dev     # VitePress
pnpm build
pnpm test
pnpm lint:all
```

## 📬 Contact

- Issues: [Issues](https://github.com/Crayon-hua/orcha/issues)

## License

[Apache-2.0](./LICENSE)
