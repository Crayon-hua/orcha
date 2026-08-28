import type { App, Plugin } from 'vue'
import DesignerToolbar from './DesignerToolbar.vue'
import NodePalette from './NodePalette.vue'
import PropertyPanel from './PropertyPanel.vue'
import WorkflowDesigner from './WorkflowDesigner.vue'
import WorkflowCanvas from '../vue/WorkflowCanvas.vue'
import { registerNodeTypes } from '../core/registry'
import type { NodeTypeDefinition } from '../core/types'

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
