export interface WorkflowViewport {
  x: number
  y: number
  zoom: number
}

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, unknown> & { label?: string }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  label?: string
  data?: Record<string, unknown>
}

export interface WorkflowDefinition {
  version: '1.0'
  id?: string
  name?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  viewport?: WorkflowViewport
}

export type NodeFieldType = 'text' | 'textarea' | 'number' | 'select'

export interface NodeFieldOption {
  label: string
  value: string
}

export interface NodeFieldDefinition {
  key: string
  label: string
  type: NodeFieldType
  placeholder?: string
  options?: NodeFieldOption[]
}

export interface NodeHandleSpec {
  id?: string
  label?: string
  position?: 'top' | 'right' | 'bottom' | 'left'
}

export interface NodeHandlesConfig {
  target?: boolean | NodeHandleSpec
  source?: boolean | NodeHandleSpec
  sources?: NodeHandleSpec[]
}

export interface NodePaletteMeta {
  group?: string
  icon?: string
  description?: string
}

export interface NodeTypeDefinition {
  type: string
  label: string
  component: object
  palette?: NodePaletteMeta
  fields?: NodeFieldDefinition[]
  handles?: NodeHandlesConfig
  defaultData?: Record<string, unknown>
}

export const DND_MIME = 'application/smart-workflow-node'

export const FLOW_ID_KEY = Symbol('sw-flow-id')
export const REGISTRY_KEY = Symbol('sw-node-registry')
export const READONLY_KEY = Symbol('sw-readonly')
export const WORKFLOW_META_KEY = Symbol('sw-workflow-meta')
