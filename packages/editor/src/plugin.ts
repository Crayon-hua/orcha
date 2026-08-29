import type { App, Plugin } from 'vue'
import type { NodeTypeDefinition } from '@ihxy/orcha-core'
import { registerNodeTypes, WorkflowCanvas } from '@ihxy/orcha-vue'
import DesignerToolbar from './DesignerToolbar.vue'
import NodePalette from './NodePalette.vue'
import PropertyPanel from './PropertyPanel.vue'
import WorkflowDesigner from './WorkflowDesigner.vue'

export interface OrchaOptions {
  nodeTypes?: NodeTypeDefinition[]
}

export const Orcha: Plugin<OrchaOptions> = {
  install(app: App, options: OrchaOptions = {}) {
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

export default Orcha
