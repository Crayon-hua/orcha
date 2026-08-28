import { cloneJson } from './id'
import { WorkflowParseError } from './json'
import { resolvePorts } from './ports'
import {
  CURRENT_CATALOG_VERSION,
  SUPPORTED_CATALOG_VERSIONS,
  type CatalogJsonVersion,
  type IODataType,
  type NodeCatalog,
  type NodeIOField,
  type NodePortsConfig,
  type NodeTypeContract,
  type NodeTypeDefinition,
} from './types'

const IO_TYPES: IODataType[] = ['string', 'number', 'boolean', 'object', 'array', 'any']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function toNodeTypeContract(
  definition: Pick<NodeTypeDefinition, 'type' | 'inputs' | 'outputs' | 'ports' | 'handles'>,
): NodeTypeContract {
  return {
    type: definition.type,
    inputs: definition.inputs ? cloneJson(definition.inputs) : [],
    outputs: definition.outputs ? cloneJson(definition.outputs) : [],
    ports: cloneJson(resolvePorts(definition)),
  }
}

export function catalogFromNodeTypes(
  definitions: Iterable<Pick<NodeTypeDefinition, 'type' | 'inputs' | 'outputs' | 'ports' | 'handles'>>,
): NodeCatalog {
  const types = [...definitions].map(definition => toNodeTypeContract(definition))
  const seen = new Set<string>()
  for (const item of types) {
    if (seen.has(item.type)) {
      throw new WorkflowParseError(`catalog 中重复的节点类型: ${item.type}`)
    }
    seen.add(item.type)
  }
  return {
    catalogVersion: CURRENT_CATALOG_VERSION,
    types,
  }
}

function parseIOField(value: unknown, owner: string, kind: 'inputs' | 'outputs', index: number): NodeIOField {
  if (!isRecord(value) || typeof value.name !== 'string' || !value.name) {
    throw new WorkflowParseError(`${owner}.${kind}[${index}] 缺少 name`)
  }
  if (typeof value.type !== 'string' || !IO_TYPES.includes(value.type as IODataType)) {
    throw new WorkflowParseError(`${owner}.${kind}[${index}] 的 type 无效`)
  }
  return {
    name: value.name,
    type: value.type as IODataType,
    ...(value.required === true ? { required: true } : {}),
    description: typeof value.description === 'string' ? value.description : undefined,
  }
}

function parsePortSpec(value: unknown): NodePortsConfig['source'] {
  if (typeof value === 'boolean') {
    return value
  }
  if (!isRecord(value)) {
    return undefined
  }
  return {
    id: typeof value.id === 'string' ? value.id : undefined,
    label: typeof value.label === 'string' ? value.label : undefined,
    position: value.position === 'top' || value.position === 'right' || value.position === 'bottom' || value.position === 'left'
      ? value.position
      : undefined,
  }
}

function parsePortSpecObject(value: unknown, owner: string, index: number): NonNullable<Exclude<NodePortsConfig['source'], boolean>> {
  if (typeof value === 'boolean' || !isRecord(value)) {
    throw new WorkflowParseError(`${owner}[${index}] 必须是对象`)
  }
  return {
    id: typeof value.id === 'string' ? value.id : undefined,
    label: typeof value.label === 'string' ? value.label : undefined,
    position: value.position === 'top' || value.position === 'right' || value.position === 'bottom' || value.position === 'left'
      ? value.position
      : undefined,
  }
}

function parsePorts(value: unknown, owner: string): NodePortsConfig {
  if (value == null) {
    return {}
  }
  if (!isRecord(value)) {
    throw new WorkflowParseError(`${owner}.ports 必须是对象`)
  }
  const sources = Array.isArray(value.sources)
    ? value.sources.map((item, index) => parsePortSpecObject(item, `${owner}.ports.sources`, index))
    : undefined
  const targets = Array.isArray(value.targets)
    ? value.targets.map((item, index) => parsePortSpecObject(item, `${owner}.ports.targets`, index))
    : undefined
  const ports: NodePortsConfig = {}
  const source = parsePortSpec(value.source)
  const target = parsePortSpec(value.target)
  if (source !== undefined) {
    ports.source = source
  }
  if (target !== undefined) {
    ports.target = target
  }
  if (sources?.length) {
    ports.sources = sources
  }
  if (targets?.length) {
    ports.targets = targets
  }
  return ports
}

function parseContract(value: unknown, index: number): NodeTypeContract {
  if (!isRecord(value)) {
    throw new WorkflowParseError(`types[${index}] 必须是对象`)
  }
  if (typeof value.type !== 'string' || !value.type) {
    throw new WorkflowParseError(`types[${index}] 缺少 type`)
  }
  const typeName = value.type
  if (!Array.isArray(value.inputs) || !Array.isArray(value.outputs)) {
    throw new WorkflowParseError(`类型 ${typeName} 的 inputs / outputs 必须是数组`)
  }
  return {
    type: typeName,
    inputs: value.inputs.map((field, fieldIndex) => parseIOField(field, typeName, 'inputs', fieldIndex)),
    outputs: value.outputs.map((field, fieldIndex) => parseIOField(field, typeName, 'outputs', fieldIndex)),
    ports: parsePorts(value.ports, typeName),
  }
}

export function isSupportedCatalogVersion(value: unknown): value is CatalogJsonVersion {
  return SUPPORTED_CATALOG_VERSIONS.includes(value as CatalogJsonVersion)
}

export function parseNodeCatalog(input: unknown): NodeCatalog {
  const parsed: unknown = typeof input === 'string' ? JSON.parse(input) : input
  if (!isRecord(parsed)) {
    throw new WorkflowParseError('catalog 必须是对象')
  }
  if (!isSupportedCatalogVersion(parsed.catalogVersion)) {
    throw new WorkflowParseError(`不支持的 catalog 版本: ${String(parsed.catalogVersion)}`)
  }
  if (!Array.isArray(parsed.types)) {
    throw new WorkflowParseError('catalog.types 必须是数组')
  }
  const types = parsed.types.map((item, index) => parseContract(item, index))
  const seen = new Set<string>()
  for (const item of types) {
    if (seen.has(item.type)) {
      throw new WorkflowParseError(`catalog 中重复的节点类型: ${item.type}`)
    }
    seen.add(item.type)
  }
  return {
    catalogVersion: parsed.catalogVersion,
    types,
  }
}
