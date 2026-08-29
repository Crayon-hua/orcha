export const CURRENT_WORKFLOW_VERSION = '1.0' as const

export const SUPPORTED_WORKFLOW_VERSIONS = ['1.0'] as const

export type WorkflowJsonVersion = (typeof SUPPORTED_WORKFLOW_VERSIONS)[number]

export const CURRENT_CATALOG_VERSION = '1.0' as const

export const SUPPORTED_CATALOG_VERSIONS = ['1.0'] as const

export type CatalogJsonVersion = (typeof SUPPORTED_CATALOG_VERSIONS)[number]

export interface WorkflowViewport {
  x: number
  y: number
  zoom: number
}

export type IODataType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'

export interface NodeIOField {
  name: string
  type: IODataType
  required?: boolean
  description?: string
}

export interface WorkflowNode {
  id: string
  type: string
  /** 设计态画布坐标，运行时忽略 */
  position: { x: number; y: number }
  data: Record<string, unknown> & { label?: string }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  /** 设计态展示标签，运行时忽略 */
  label?: string
  data?: Record<string, unknown>
}

/**
 * 流程实例 JSON（version 1.0）。
 * 运行时必填：version、nodes[].id|type|data、edges[].id|source|target。
 * 运行时忽略：position、viewport、边 label。
 */
export interface WorkflowDefinition {
  version: WorkflowJsonVersion
  id?: string
  name?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  /** 设计态视口，运行时忽略 */
  viewport?: WorkflowViewport
}

/** 可序列化的节点 IO/ports 契约，不含 Vue 组件与表单 UI */
export interface NodeTypeContract {
  type: string
  inputs: NodeIOField[]
  outputs: NodeIOField[]
  ports: NodePortsConfig
}

export interface NodeCatalog {
  catalogVersion: CatalogJsonVersion
  types: NodeTypeContract[]
}

export interface RuntimePayload {
  workflow: WorkflowDefinition
  catalog: NodeCatalog
}

export type FormFieldType = 'text' | 'textarea' | 'number' | 'select' | 'variable'

/** @deprecated 使用 FormFieldType，保留以兼容已发布的 fields API */
export type NodeFieldType = FormFieldType

export interface FormFieldOption {
  label: string
  value: string
}

/** @deprecated 使用 FormFieldOption */
export type NodeFieldOption = FormFieldOption

export interface FormFieldSchema {
  key: string
  label: string
  type: FormFieldType
  placeholder?: string
  options?: FormFieldOption[]
  required?: boolean
}

/** @deprecated 使用 FormFieldSchema，现有 fields[] 视为 FormSchema v0 */
export type NodeFieldDefinition = FormFieldSchema

export interface FormSchema {
  fields: FormFieldSchema[]
}

export interface NodePortSpec {
  id?: string
  label?: string
  position?: 'top' | 'right' | 'bottom' | 'left'
}

export interface NodePortsConfig {
  target?: boolean | NodePortSpec
  source?: boolean | NodePortSpec
  sources?: NodePortSpec[]
  targets?: NodePortSpec[]
}

/** @deprecated 使用 NodePortsConfig */
export type NodeHandleSpec = NodePortSpec
/** @deprecated 使用 NodePortsConfig */
export type NodeHandlesConfig = NodePortsConfig

export interface NodePaletteMeta {
  group?: string
  icon?: string
  description?: string
  color?: string
}

export interface NodeTypeDefinition {
  type: string
  label: string
  component: object
  palette?: NodePaletteMeta
  form?: FormSchema
  /** FormSchema v0，未提供 form 时自动提升 */
  fields?: FormFieldSchema[]
  ports?: NodePortsConfig
  /** ports 的旧名 */
  handles?: NodePortsConfig
  inputs?: NodeIOField[]
  outputs?: NodeIOField[]
  defaultData?: Record<string, unknown>
}

export type NodeRegistry = Map<string, NodeTypeDefinition>
