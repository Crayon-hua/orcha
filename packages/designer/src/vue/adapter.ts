import type { Component } from 'vue'
import { markRaw } from 'vue'
import { CURRENT_WORKFLOW_VERSION } from '../core/types'
import type { NodeRegistry } from '../core/registry'
import type { WorkflowDefinition, WorkflowEdge, WorkflowNode, WorkflowViewport } from '../core/types'

export interface FlowNodeLike {
  id: string
  type?: string
  position: { x: number; y: number }
  data?: Record<string, unknown>
  selected?: boolean
}

export interface FlowEdgeLike {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  label?: string
  data?: Record<string, unknown>
  selected?: boolean
}

export function workflowFromFlow(
  nodes: FlowNodeLike[],
  edges: FlowEdgeLike[],
  viewport?: WorkflowViewport,
  meta?: { id?: string; name?: string },
): WorkflowDefinition {
  return {
    version: CURRENT_WORKFLOW_VERSION,
    id: meta?.id,
    name: meta?.name,
    nodes: nodes.map((node): WorkflowNode => ({
      id: node.id,
      type: node.type ?? 'task',
      position: { x: node.position.x, y: node.position.y },
      data: { ...(node.data as Record<string, unknown> | undefined) },
    })),
    edges: edges.map((edge): WorkflowEdge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: typeof edge.label === 'string' ? edge.label : undefined,
      data: edge.data as Record<string, unknown> | undefined,
    })),
    viewport: viewport
      ? { x: viewport.x, y: viewport.y, zoom: viewport.zoom }
      : undefined,
  }
}

export function flowFromWorkflow(workflow: WorkflowDefinition): {
  nodes: FlowNodeLike[]
  edges: FlowEdgeLike[]
  viewport?: WorkflowViewport
} {
  return {
    nodes: workflow.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: { ...node.position },
      data: { ...node.data },
    })),
    edges: workflow.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
      label: edge.label,
      data: edge.data,
    })),
    viewport: workflow.viewport ? { ...workflow.viewport } : undefined,
  }
}

export function toVueFlowNodeTypes(registry: NodeRegistry): Record<string, Component> {
  const types: Record<string, Component> = {}
  for (const definition of registry.values()) {
    types[definition.type] = markRaw(definition.component as Component)
  }
  return types
}
