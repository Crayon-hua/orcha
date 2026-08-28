import type { Component } from 'vue'
import { markRaw } from 'vue'
import type { NodeTypeDefinition } from '../types/workflow'

export type NodeRegistry = Map<string, NodeTypeDefinition>

const globalRegistry: NodeRegistry = new Map()

export function defineNodeType(definition: NodeTypeDefinition): NodeTypeDefinition {
  return {
    ...definition,
    component: markRaw(definition.component as Component),
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

export function toVueFlowNodeTypes(registry: NodeRegistry): Record<string, Component> {
  const types: Record<string, Component> = {}
  for (const definition of registry.values()) {
    types[definition.type] = markRaw(definition.component as Component)
  }
  return types
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
  const sourceHasOutput = Boolean(
    source.handles?.source || (source.handles?.sources && source.handles.sources.length > 0),
  )
  const targetHasInput = Boolean(target.handles?.target)
  return sourceHasOutput && targetHasInput
}
