import type { Component } from 'vue'
import { markRaw } from 'vue'
import {
  listSourcePortsFromConfig,
  listTargetPortsFromConfig,
  resolvePorts,
  type FormSchema,
  type NodePortSpec,
  type NodeRegistry,
  type NodeTypeDefinition,
} from '@ihxy/orcha-core'

export { listSourcePortsFromConfig, listTargetPortsFromConfig, resolvePorts } from '@ihxy/orcha-core'
export type { NodeRegistry } from '@ihxy/orcha-core'

const globalRegistry: NodeRegistry = new Map()

export function resolveFormSchema(definition: NodeTypeDefinition): FormSchema {
  if (definition.form) {
    return definition.form
  }
  return { fields: definition.fields ?? [] }
}

export function listSourcePorts(definition: NodeTypeDefinition): NodePortSpec[] {
  return listSourcePortsFromConfig(resolvePorts(definition))
}

export function listTargetPorts(definition: NodeTypeDefinition): NodePortSpec[] {
  return listTargetPortsFromConfig(resolvePorts(definition))
}

export function sourcePortLabel(definition: NodeTypeDefinition, handleId?: string | null): string | undefined {
  const ports = listSourcePorts(definition)
  if (!ports.length) {
    return undefined
  }
  const match = handleId
    ? ports.find(port => port.id === handleId)
    : ports[0]
  return match?.label
}

export function defineNodeType(definition: NodeTypeDefinition): NodeTypeDefinition {
  return {
    ...definition,
    component: markRaw(definition.component as Component),
    ports: resolvePorts(definition),
    form: resolveFormSchema(definition),
  }
}

export function registerNodeTypes(definitions: NodeTypeDefinition[]): void {
  for (const definition of definitions) {
    globalRegistry.set(definition.type, defineNodeType(definition))
  }
}

export function getGlobalRegistry(): NodeRegistry {
  return globalRegistry
}

export function createMergedRegistry(extra?: NodeTypeDefinition[]): NodeRegistry {
  const merged: NodeRegistry = new Map(globalRegistry)
  if (extra) {
    for (const definition of extra) {
      merged.set(definition.type, defineNodeType(definition))
    }
  }
  return merged
}

export function getNodeType(registry: NodeRegistry, type: string): NodeTypeDefinition | undefined {
  return registry.get(type)
}

export function listNodeTypes(registry: NodeRegistry): NodeTypeDefinition[] {
  return [...registry.values()]
}

export function isConnectionAllowed(
  registry: NodeRegistry,
  sourceType: string,
  targetType: string,
): boolean {
  const source = registry.get(sourceType)
  const target = registry.get(targetType)
  if (!source || !target) {
    return sourceType !== 'end' && targetType !== 'start'
  }
  return listSourcePorts(source).length > 0 && listTargetPorts(target).length > 0
}
