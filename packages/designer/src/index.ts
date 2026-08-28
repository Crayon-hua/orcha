import './styles/index.css'
import './materials/builtin'

export { default as DesignerToolbar } from './editor/DesignerToolbar.vue'
export { default as NodePalette } from './editor/NodePalette.vue'
export { default as PropertyPanel } from './editor/PropertyPanel.vue'
export { default as WorkflowDesigner } from './editor/WorkflowDesigner.vue'
export { default as WorkflowCanvas } from './vue/WorkflowCanvas.vue'
export { default as FormRenderer } from './form/FormRenderer.vue'

export {
  catalogFromNodeTypes,
  cloneWorkflow,
  createCommandStack,
  createEmptyWorkflow,
  createId,
  createMergedRegistry,
  createWorkflowDocument,
  CURRENT_CATALOG_VERSION,
  CURRENT_WORKFLOW_VERSION,
  defineNodeType,
  getGlobalRegistry,
  isSupportedCatalogVersion,
  isSupportedWorkflowVersion,
  listNodeTypes,
  listSourcePorts,
  listTargetPorts,
  migrateWorkflow,
  parseNodeCatalog,
  parseWorkflow,
  registerNodeTypes,
  resolveFormSchema,
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
} from './core'
export { extractTemplateExpressions, listAncestorNodeIds, listUpstreamVariables, parseTemplate, toTemplateExpression } from './variable'
export type { TemplateSegment, VariableRef } from './variable'
export { builtinNodeCatalog, builtinNodeTypes } from './materials'
export { createFormModel } from './form'
export type { FormModel } from './form'
export {
  copyPastePlugin,
  createWorkflowEditor,
  defaultEditorPlugins,
  handleEditorKeydown,
  historyPlugin,
  keyboardPlugin,
} from './plugins'
export type { CanvasHandle, EditorContext, WorkflowPlugin } from './plugins'
export { flowFromWorkflow, workflowFromFlow } from './vue'
export { SmartWorkflowDesigner } from './editor/plugin'
export { default } from './editor/plugin'
export type { SmartWorkflowDesignerOptions } from './editor/plugin'
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
} from './core'
