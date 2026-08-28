import type { WorkflowDocument } from './document'
import type { WorkflowDefinition, WorkflowEdge, WorkflowNode } from './types'

export interface DocumentCommand {
  name: string
  execute: () => void
  undo: () => void
}

export interface CommandStack {
  readonly canUndo: boolean
  readonly canRedo: boolean
  execute: (command: DocumentCommand) => void
  undo: () => void
  redo: () => void
  clear: () => void
  subscribe: (listener: () => void) => () => void
}

const MAX_HISTORY = 50

export function createCommandStack(): CommandStack {
  const undoStack: DocumentCommand[] = []
  const redoStack: DocumentCommand[] = []
  const listeners = new Set<() => void>()

  function notify(): void {
    for (const listener of listeners) {
      listener()
    }
  }

  return {
    get canUndo() {
      return undoStack.length > 0
    },
    get canRedo() {
      return redoStack.length > 0
    },
    execute(command: DocumentCommand): void {
      command.execute()
      undoStack.push(command)
      if (undoStack.length > MAX_HISTORY) {
        undoStack.shift()
      }
      redoStack.length = 0
      notify()
    },
    undo(): void {
      const command = undoStack.pop()
      if (!command) {
        return
      }
      command.undo()
      redoStack.push(command)
      notify()
    },
    redo(): void {
      const command = redoStack.pop()
      if (!command) {
        return
      }
      command.execute()
      undoStack.push(command)
      notify()
    },
    clear(): void {
      undoStack.length = 0
      redoStack.length = 0
      notify()
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export function addNodeCommand(document: WorkflowDocument, node: WorkflowNode): DocumentCommand {
  return {
    name: 'addNode',
    execute: () => {
      document.addNode(node)
    },
    undo: () => {
      document.removeNodes([node.id])
    },
  }
}

export function addEdgeCommand(document: WorkflowDocument, edge: WorkflowEdge): DocumentCommand {
  return {
    name: 'addEdge',
    execute: () => {
      document.addEdge(edge)
    },
    undo: () => {
      document.removeEdges([edge.id])
    },
  }
}

export function removeSelectionCommand(
  document: WorkflowDocument,
  nodeIds: string[],
  edgeIds: string[],
): DocumentCommand {
  let removedNodes: WorkflowNode[] = []
  let removedEdges: WorkflowEdge[] = []
  return {
    name: 'removeSelection',
    execute: () => {
      const nodeResult = nodeIds.length ? document.removeNodes(nodeIds) : { nodes: [], edges: [] }
      removedNodes = nodeResult.nodes
      const leftoverEdgeIds = edgeIds.filter(id => !nodeResult.edges.some(edge => edge.id === id))
      removedEdges = [
        ...nodeResult.edges,
        ...(leftoverEdgeIds.length ? document.removeEdges(leftoverEdgeIds) : []),
      ]
    },
    undo: () => {
      document.restoreRemoved(removedNodes, removedEdges)
    },
  }
}

export function updateNodeDataCommand(
  document: WorkflowDocument,
  nodeId: string,
  patch: Record<string, unknown>,
): DocumentCommand {
  let previous: Record<string, unknown> = {}
  return {
    name: 'updateNodeData',
    execute: () => {
      previous = document.updateNodeData(nodeId, patch)
    },
    undo: () => {
      document.replaceNodeData(nodeId, previous)
    },
  }
}

export function setNodePositionsCommand(
  document: WorkflowDocument,
  positions: Array<{ id: string; x: number; y: number }>,
): DocumentCommand {
  let previous: Array<{ id: string; x: number; y: number }> = []
  return {
    name: 'setNodePositions',
    execute: () => {
      previous = document.setNodePositions(positions)
    },
    undo: () => {
      document.setNodePositions(previous)
    },
  }
}

export function setNameCommand(document: WorkflowDocument, name: string): DocumentCommand {
  let previous = ''
  return {
    name: 'setName',
    execute: () => {
      previous = document.setName(name)
    },
    undo: () => {
      document.setName(previous)
    },
  }
}

export function replaceWorkflowCommand(
  document: WorkflowDocument,
  next: WorkflowDefinition,
): DocumentCommand {
  const previous = document.snapshot()
  return {
    name: 'replaceWorkflow',
    execute: () => {
      document.load(next)
    },
    undo: () => {
      document.load(previous)
    },
  }
}

export function pasteCommand(
  document: WorkflowDocument,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): DocumentCommand {
  return {
    name: 'paste',
    execute: () => {
      for (const node of nodes) {
        document.addNode(node)
      }
      for (const edge of edges) {
        document.addEdge(edge)
      }
    },
    undo: () => {
      document.removeNodes(nodes.map(node => node.id))
      document.removeEdges(edges.map(edge => edge.id))
    },
  }
}
