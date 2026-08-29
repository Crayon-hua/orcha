import './styles.css'
import '@ihxy/orcha-materials'

export { default as DesignerToolbar } from './DesignerToolbar.vue'
export { default as NodePalette } from './NodePalette.vue'
export { default as PropertyPanel } from './PropertyPanel.vue'
export { default as WorkflowDesigner } from './WorkflowDesigner.vue'
export { WorkflowCanvas } from '@ihxy/orcha-vue'
export { FormRenderer } from '@ihxy/orcha-form'

export {
  catalogFromNodeTypes,
  cloneWorkflow,
  createCommandStack,
  createEmptyWorkflow,
  createId,
  createWorkflowDocument,
  CURRENT_CATALOG_VERSION,
  CURRENT_WORKFLOW_VERSION,
  isSupportedCatalogVersion,
  isSupportedWorkflowVersion,
  migrateWorkflow,
  parseNodeCatalog,
  parseWorkflow,
  resolvePorts,
  serializeWorkflow,
  SUPPORTED_CATALOG_VERSIONS,
  SUPPORTED_WORKFLOW_VERSIONS,
  toNodeTypeContract,
  toRuntimePayload,
  validateWorkflowAgainstCatalog,
  WorkflowDocument,
  WorkflowParseError,
  WorkflowValidationError,
} from '@ihxy/orcha-core'
export {
  createMergedRegistry,
  defineNodeType,
  getGlobalRegistry,
  Handle,
  listNodeTypes,
  listSourcePorts,
  listTargetPorts,
  Position,
  registerNodeTypes,
  resolveFormSchema,
  useVueFlow,
} from '@ihxy/orcha-vue'
export { extractTemplateExpressions, listAncestorNodeIds, listUpstreamVariables, parseTemplate, toTemplateExpression } from '@ihxy/orcha-variable'
export type { TemplateSegment, VariableRef } from '@ihxy/orcha-variable'
export { builtinNodeCatalog, builtinNodeTypes } from '@ihxy/orcha-materials'
export { createFormModel } from '@ihxy/orcha-form'
export type { FormModel } from '@ihxy/orcha-form'
export {
  copyPastePlugin,
  createWorkflowEditor,
  defaultEditorPlugins,
  handleEditorKeydown,
  historyPlugin,
  keyboardPlugin,
} from '@ihxy/orcha-plugins'
export type { CanvasHandle, EditorContext, WorkflowPlugin } from '@ihxy/orcha-plugins'
export { flowFromWorkflow, workflowFromFlow } from '@ihxy/orcha-vue'
export { Orcha } from './plugin'
export { default } from './plugin'
export type { OrchaOptions } from './plugin'
export type {
  CatalogJsonVersion,
  FormFieldOption,
  FormFieldSchema,
  FormFieldType,
  FormSchema,
  IODataType,
  NodeCatalog,
  NodeFieldDefinition,
  NodeFieldOption,
  NodeFieldType,
  NodeHandleSpec,
  NodeHandlesConfig,
  NodeIOField,
  NodePaletteMeta,
  NodePortSpec,
  NodePortsConfig,
  NodeRegistry,
  NodeTypeContract,
  NodeTypeDefinition,
  RuntimePayload,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowJsonVersion,
  WorkflowNode,
  WorkflowViewport,
} from '@ihxy/orcha-core'
