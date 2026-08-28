import type { WorkflowDefinition, WorkflowEdge, WorkflowNode, WorkflowViewport } from '../types/workflow'
import { cloneJson } from './id'

export interface FlowNodeLike {
  id: string
  type?: string
  position: { x: number; y: number }
  data?: Record<string, unknown>
}

export interface FlowEdgeLike {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  label?: string
  data?: Record<string, unknown>
}

export class WorkflowParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkflowParseError'
  }
}

export function createEmptyWorkflow(name = '未命名流程'): WorkflowDefinition {
  return {
    version: '1.0',
    name,
    nodes: [],
    edges: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsePosition(value: unknown, nodeId: string): { x: number; y: number } {
  if (!isRecord(value) || typeof value.x !== 'number' || typeof value.y !== 'number') {
    throw new WorkflowParseError(`节点 ${nodeId} 缺少有效的 position`)
  }
  return { x: value.x, y: value.y }
}

function parseNode(value: unknown, index: number): WorkflowNode {
  if (!isRecord(value)) {
    throw new WorkflowParseError(`nodes[${index}] 必须是对象`)
  }
  if (typeof value.id !== 'string' || !value.id) {
    throw new WorkflowParseError(`nodes[${index}] 缺少 id`)
  }
  if (typeof value.type !== 'string' || !value.type) {
    throw new WorkflowParseError(`节点 ${value.id} 缺少 type`)
  }
  const data = isRecord(value.data) ? { ...value.data } : {}
  return {
    id: value.id,
    type: value.type,
    position: parsePosition(value.position, value.id),
    data,
  }
}

function parseEdge(value: unknown, index: number): WorkflowEdge {
  if (!isRecord(value)) {
    throw new WorkflowParseError(`edges[${index}] 必须是对象`)
  }
  if (typeof value.id !== 'string' || !value.id) {
    throw new WorkflowParseError(`edges[${index}] 缺少 id`)
  }
  if (typeof value.source !== 'string' || typeof value.target !== 'string') {
    throw new WorkflowParseError(`边 ${value.id} 缺少 source 或 target`)
  }
  return {
    id: value.id,
    source: value.source,
    target: value.target,
    sourceHandle: typeof value.sourceHandle === 'string' ? value.sourceHandle : null,
    targetHandle: typeof value.targetHandle === 'string' ? value.targetHandle : null,
    label: typeof value.label === 'string' ? value.label : undefined,
    data: isRecord(value.data) ? { ...value.data } : undefined,
  }
}

function parseViewport(value: unknown): WorkflowViewport | undefined {
  if (value == null) {
    return undefined
  }
  if (
    !isRecord(value)
    || typeof value.x !== 'number'
    || typeof value.y !== 'number'
    || typeof value.zoom !== 'number'
  ) {
    throw new WorkflowParseError('viewport 必须包含 x / y / zoom 数字字段')
  }
  return { x: value.x, y: value.y, zoom: value.zoom }
}

export function parseWorkflow(input: unknown): WorkflowDefinition {
  const raw: unknown = typeof input === 'string' ? JSON.parse(input) : input
  if (!isRecord(raw)) {
    throw new WorkflowParseError('工作流数据必须是对象')
  }
  if (raw.version !== '1.0') {
    throw new WorkflowParseError(`不支持的工作流版本: ${String(raw.version)}`)
  }
  if (!Array.isArray(raw.nodes) || !Array.isArray(raw.edges)) {
    throw new WorkflowParseError('nodes 和 edges 必须是数组')
  }

  const nodes = raw.nodes.map((node, index) => parseNode(node, index))
  const ids = new Set<string>()
  for (const node of nodes) {
    if (ids.has(node.id)) {
      throw new WorkflowParseError(`重复的节点 id: ${node.id}`)
    }
    ids.add(node.id)
  }

  const edges = raw.edges.map((edge, index) => parseEdge(edge, index))
  const edgeIds = new Set<string>()
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) {
      throw new WorkflowParseError(`重复的边 id: ${edge.id}`)
    }
    edgeIds.add(edge.id)
    if (!ids.has(edge.source)) {
      throw new WorkflowParseError(`边 ${edge.id} 的 source 不存在: ${edge.source}`)
    }
    if (!ids.has(edge.target)) {
      throw new WorkflowParseError(`边 ${edge.id} 的 target 不存在: ${edge.target}`)
    }
  }

  return {
    version: '1.0',
    id: typeof raw.id === 'string' ? raw.id : undefined,
    name: typeof raw.name === 'string' ? raw.name : undefined,
    nodes,
    edges,
    viewport: parseViewport(raw.viewport),
  }
}

export function serializeWorkflow(workflow: WorkflowDefinition, pretty = true): string {
  const normalized = parseWorkflow(workflow)
  return pretty ? JSON.stringify(normalized, null, 2) : JSON.stringify(normalized)
}

export function workflowFromFlow(
  nodes: FlowNodeLike[],
  edges: FlowEdgeLike[],
  viewport?: WorkflowViewport,
  meta?: { id?: string; name?: string },
): WorkflowDefinition {
  return {
    version: '1.0',
    id: meta?.id,
    name: meta?.name,
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type ?? 'task',
      position: { x: node.position.x, y: node.position.y },
      data: { ...(node.data as Record<string, unknown> | undefined) },
    })),
    edges: edges.map((edge) => ({
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
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: { ...node.position },
      data: { ...node.data },
    })),
    edges: workflow.edges.map((edge) => ({
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

export function cloneWorkflow(workflow: WorkflowDefinition): WorkflowDefinition {
  return cloneJson(workflow)
}
