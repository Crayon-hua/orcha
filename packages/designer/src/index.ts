import './styles/index.css'
import './registry/builtin'

export { default as DesignerToolbar } from './components/DesignerToolbar.vue'
export { default as NodePalette } from './components/NodePalette.vue'
export { default as PropertyPanel } from './components/PropertyPanel.vue'
export { default as WorkflowCanvas } from './components/WorkflowCanvas.vue'
export { default as WorkflowDesigner } from './components/WorkflowDesigner.vue'
export {
  defineNodeType,
  getGlobalRegistry,
  listNodeTypes,
  registerNodeTypes,
} from './registry/node-registry'
export { builtinNodeTypes } from './registry/builtin'
export {
  cloneWorkflow,
  createEmptyWorkflow,
  flowFromWorkflow,
  parseWorkflow,
  serializeWorkflow,
  workflowFromFlow,
  WorkflowParseError,
} from './utils/workflow'
export { createId } from './utils/id'
export { SmartWorkflowDesigner } from './plugin'
export { default } from './plugin'
export type { SmartWorkflowDesignerOptions } from './plugin'
export type {
  NodeFieldDefinition,
  NodeFieldOption,
  NodeFieldType,
  NodeHandlesConfig,
  NodeHandleSpec,
  NodePaletteMeta,
  NodeTypeDefinition,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
  WorkflowViewport,
} from './types/workflow'
