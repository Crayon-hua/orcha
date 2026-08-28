import { cloneJson } from './id'
import { cloneWorkflow, parseWorkflow } from './json'
import type { WorkflowDefinition, WorkflowEdge, WorkflowNode, WorkflowViewport } from './types'

type DocumentListener = () => void

export class WorkflowDocument {
  private workflow: WorkflowDefinition
  private listeners = new Set<DocumentListener>()

  constructor(initial: WorkflowDefinition) {
    this.workflow = cloneWorkflow(parseWorkflow(initial))
  }

  snapshot(): WorkflowDefinition {
    return cloneWorkflow(this.workflow)
  }

  subscribe(listener: DocumentListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  load(workflow: WorkflowDefinition): void {
    this.workflow = cloneWorkflow(parseWorkflow(workflow))
    this.notify()
  }

  addNode(node: WorkflowNode): void {
    if (this.workflow.nodes.some(item => item.id === node.id)) {
      throw new Error(`节点已存在: ${node.id}`)
    }
    this.workflow.nodes = [...this.workflow.nodes, cloneJson(node)]
    this.notify()
  }

  removeNodes(ids: string[]): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
    const idSet = new Set(ids)
    const removedNodes = this.workflow.nodes.filter(node => idSet.has(node.id))
    const removedEdges = this.workflow.edges.filter(
      edge => idSet.has(edge.source) || idSet.has(edge.target),
    )
    this.workflow.nodes = this.workflow.nodes.filter(node => !idSet.has(node.id))
    this.workflow.edges = this.workflow.edges.filter(
      edge => !idSet.has(edge.source) && !idSet.has(edge.target),
    )
    this.notify()
    return { nodes: removedNodes, edges: removedEdges }
  }

  addEdge(edge: WorkflowEdge): void {
    if (this.workflow.edges.some(item => item.id === edge.id)) {
      throw new Error(`边已存在: ${edge.id}`)
    }
    this.workflow.edges = [...this.workflow.edges, { ...edge, data: edge.data ? { ...edge.data } : undefined }]
    this.notify()
  }

  removeEdges(ids: string[]): WorkflowEdge[] {
    const idSet = new Set(ids)
    const removed = this.workflow.edges.filter(edge => idSet.has(edge.id))
    this.workflow.edges = this.workflow.edges.filter(edge => !idSet.has(edge.id))
    this.notify()
    return removed
  }

  restoreRemoved(nodes: WorkflowNode[], edges: WorkflowEdge[]): void {
    this.workflow.nodes = [...this.workflow.nodes, ...nodes.map(node => ({
      ...node,
      position: { ...node.position },
      data: { ...node.data },
    }))]
    this.workflow.edges = [...this.workflow.edges, ...edges.map(edge => ({
      ...edge,
      data: edge.data ? { ...edge.data } : undefined,
    }))]
    this.notify()
  }

  updateNodeData(id: string, patch: Record<string, unknown>): Record<string, unknown> {
    const node = this.workflow.nodes.find(item => item.id === id)
    if (!node) {
      throw new Error(`节点不存在: ${id}`)
    }
    const previous = { ...node.data }
    node.data = { ...node.data, ...patch }
    this.notify()
    return previous
  }

  replaceNodeData(id: string, data: Record<string, unknown>): void {
    const node = this.workflow.nodes.find(item => item.id === id)
    if (!node) {
      throw new Error(`节点不存在: ${id}`)
    }
    node.data = { ...data }
    this.notify()
  }

  setNodePositions(positions: Array<{ id: string; x: number; y: number }>): Array<{ id: string; x: number; y: number }> {
    const previous: Array<{ id: string; x: number; y: number }> = []
    const map = new Map(positions.map(item => [item.id, item]))
    for (const node of this.workflow.nodes) {
      const next = map.get(node.id)
      if (!next) {
        continue
      }
      previous.push({ id: node.id, x: node.position.x, y: node.position.y })
      node.position = { x: next.x, y: next.y }
    }
    this.notify()
    return previous
  }

  setName(name: string): string {
    const previous = this.workflow.name ?? ''
    this.workflow.name = name
    this.notify()
    return previous
  }

  setViewport(viewport: WorkflowViewport | undefined, silent = false): void {
    this.workflow.viewport = viewport ? { ...viewport } : undefined
    if (!silent) {
      this.notify()
    }
  }

  setMeta(meta: { id?: string; name?: string }): void {
    if (meta.id) {
      this.workflow.id = meta.id
    }
    if (meta.name !== undefined) {
      this.workflow.name = meta.name
    }
    this.notify()
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener()
    }
  }
}

export function createWorkflowDocument(initial: WorkflowDefinition): WorkflowDocument {
  return new WorkflowDocument(initial)
}
