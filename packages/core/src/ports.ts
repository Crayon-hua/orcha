import type { NodePortSpec, NodePortsConfig, NodeTypeDefinition } from './types'

function asPort(value: boolean | NodePortSpec | undefined, fallbackId: string): NodePortSpec | undefined {
  if (value === true) {
    return { id: fallbackId }
  }
  if (value && typeof value === 'object') {
    return { id: value.id ?? fallbackId, label: value.label, position: value.position }
  }
  return undefined
}

export function resolvePorts(definition: Pick<NodeTypeDefinition, 'ports' | 'handles'> | { ports?: NodePortsConfig }): NodePortsConfig {
  if ('handles' in definition) {
    return definition.ports ?? definition.handles ?? {}
  }
  return definition.ports ?? {}
}

export function listSourcePortsFromConfig(ports: NodePortsConfig): NodePortSpec[] {
  if (ports.sources?.length) {
    return ports.sources.map(port => ({
      ...port,
      id: port.id ?? 'source',
    }))
  }
  const source = asPort(ports.source, 'source')
  return source ? [source] : []
}

export function listTargetPortsFromConfig(ports: NodePortsConfig): NodePortSpec[] {
  if (ports.targets?.length) {
    return ports.targets.map(port => ({
      ...port,
      id: port.id ?? 'target',
    }))
  }
  const target = asPort(ports.target, 'target')
  return target ? [target] : []
}
