import type { Ref } from 'vue'
import type { CommandStack, NodeRegistry, WorkflowDocument, WorkflowViewport } from '@ihxy/orcha-core'

export interface CanvasHandle {
  getViewport: () => WorkflowViewport
  setViewport: (viewport: WorkflowViewport) => void
  fitView: (options?: { padding?: number }) => void
  getViewNodes: () => Array<{
    id: string
    type?: string
    position: { x: number; y: number }
    data?: Record<string, unknown>
  }>
  getViewEdges: () => Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }>
  getSelectedNodeIds: () => string[]
  getSelectedEdgeIds: () => string[]
}

export interface EditorContext {
  flowId: string
  document: WorkflowDocument
  registry: NodeRegistry
  readonly: Ref<boolean>
  commands: CommandStack
  revision: Ref<number>
  getCanvas: () => CanvasHandle | null
}

export interface WorkflowPlugin {
  name: string
  install: (context: EditorContext) => void | (() => void)
}

export function createWorkflowEditor(options: {
  flowId: string
  document: WorkflowDocument
  registry: NodeRegistry
  readonly: Ref<boolean>
  commands: CommandStack
  revision: Ref<number>
  getCanvas: () => CanvasHandle | null
  plugins: WorkflowPlugin[]
}): { context: EditorContext; dispose: () => void } {
  const context: EditorContext = {
    flowId: options.flowId,
    document: options.document,
    registry: options.registry,
    readonly: options.readonly,
    commands: options.commands,
    revision: options.revision,
    getCanvas: options.getCanvas,
  }
  const disposers: Array<() => void> = []
  for (const plugin of options.plugins) {
    const dispose = plugin.install(context)
    if (dispose) {
      disposers.push(dispose)
    }
  }
  return {
    context,
    dispose() {
      for (const dispose of disposers) {
        dispose()
      }
    },
  }
}
