# 编辑器

`@ihxy/orcha-editor` 拼装节点面板、画布、属性面板和工具栏。

本页为占位，内容稍后补充。

## Props（预览）

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `modelValue` / `v-model` | `WorkflowDefinition` | 工作流 JSON |
| `nodeTypes` | `NodeTypeDefinition[]` | 追加自定义节点 |
| `readonly` / `v-model:readonly` | `boolean` | 只读模式 |
| `flowId` | `string` | 可选，多实例时区分 Vue Flow store |
