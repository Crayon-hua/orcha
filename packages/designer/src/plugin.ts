import type { App, Plugin } from 'vue'
import DesignerToolbar from './components/DesignerToolbar.vue'
import NodePalette from './components/NodePalette.vue'
import PropertyPanel from './components/PropertyPanel.vue'
import WorkflowCanvas from './components/WorkflowCanvas.vue'
import WorkflowDesigner from './components/WorkflowDesigner.vue'
import { registerNodeTypes } from './registry/node-registry'
import type { NodeTypeDefinition } from './types/workflow'

export interface SmartWorkflowDesignerOptions {
  nodeTypes?: NodeTypeDefinition[]
}

export const SmartWorkflowDesigner: Plugin<SmartWorkflowDesignerOptions> = {
  install(app: App, options: SmartWorkflowDesignerOptions = {}) {
    app.component('WorkflowDesigner', WorkflowDesigner)
    app.component('WorkflowCanvas', WorkflowCanvas)
    app.component('NodePalette', NodePalette)
    app.component('PropertyPanel', PropertyPanel)
    app.component('DesignerToolbar', DesignerToolbar)
    if (options.nodeTypes?.length) {
      registerNodeTypes(options.nodeTypes)
    }
  },
}

export default SmartWorkflowDesigner
