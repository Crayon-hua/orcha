import { cloneJson, createId, pasteCommand, type WorkflowEdge, type WorkflowNode } from '@ihxy/orcha-core'
import type { EditorContext, WorkflowPlugin } from './types'

const OFFSET = 40

export interface ClipboardPayload {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export function copyPastePlugin(): WorkflowPlugin {
  return {
    name: 'copy-paste',
    install(context: EditorContext) {
      const clipboard: { payload: ClipboardPayload | null } = { payload: null }

      function copy(): void {
        const canvas = context.getCanvas()
        if (!canvas) {
          return
        }
        const selectedNodeIds = new Set(canvas.getSelectedNodeIds())
        if (!selectedNodeIds.size) {
          return
        }
        const snapshot = context.document.snapshot()
        clipboard.payload = {
          nodes: snapshot.nodes.filter(node => selectedNodeIds.has(node.id)).map(node => cloneJson(node)),
          edges: snapshot.edges
            .filter(edge => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target))
            .map(edge => cloneJson(edge)),
        }
      }

      function paste(): void {
        if (context.readonly.value || !clipboard.payload?.nodes.length) {
          return
        }
        const idMap = new Map<string, string>()
        const nodes = clipboard.payload.nodes.map((node) => {
          const id = createId('n')
          idMap.set(node.id, id)
          return {
            ...cloneJson(node),
            id,
            position: {
              x: node.position.x + OFFSET,
              y: node.position.y + OFFSET,
            },
          }
        })
        const edges = clipboard.payload.edges.flatMap((edge) => {
          const source = idMap.get(edge.source)
          const target = idMap.get(edge.target)
          if (!source || !target) {
            return []
          }
          return [{
            ...cloneJson(edge),
            id: createId('e'),
            source,
            target,
          }]
        })
        context.commands.execute(pasteCommand(context.document, nodes, edges))
      }

      Object.assign(context, { copy, paste })
    },
  }
}

export function getClipboardActions(context: EditorContext): { copy: () => void; paste: () => void } {
  const extra = context as EditorContext & { copy?: () => void; paste?: () => void }
  return {
    copy: extra.copy ?? (() => undefined),
    paste: extra.paste ?? (() => undefined),
  }
}
