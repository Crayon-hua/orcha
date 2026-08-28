import { cloneJson } from './id'
import {
  CURRENT_WORKFLOW_VERSION,
  SUPPORTED_WORKFLOW_VERSIONS,
  type WorkflowDefinition,
  type WorkflowEdge,
  type WorkflowJsonVersion,
  type WorkflowNode,
  type WorkflowViewport,
} from './types'

export class WorkflowParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkflowParseError'
  }
}

export function isSupportedWorkflowVersion(value: unknown): value is WorkflowJsonVersion {
  return SUPPORTED_WORKFLOW_VERSIONS.includes(value as WorkflowJsonVersion)
}

export function createEmptyWorkflow(name = '未命名流程'): WorkflowDefinition {
  return {
    version: CURRENT_WORKFLOW_VERSION,
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

export function migrateWorkflow(raw: Record<string, unknown>): Record<string, unknown> {
  if (!isSupportedWorkflowVersion(raw.version)) {
    throw new WorkflowParseError(`不支持的工作流版本: ${String(raw.version)}`)
  }
  return raw
}

export function parseWorkflow(input: unknown): WorkflowDefinition {
  const parsed: unknown = typeof input === 'string' ? JSON.parse(input) : input
  if (!isRecord(parsed)) {
    throw new WorkflowParseError('工作流数据必须是对象')
  }
  const raw = migrateWorkflow(parsed)
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
    version: raw.version as WorkflowJsonVersion,
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

export function cloneWorkflow(workflow: WorkflowDefinition): WorkflowDefinition {
  return cloneJson(workflow)
}
