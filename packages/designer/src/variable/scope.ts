import { listAncestorNodeIds } from '@ihxy/workflow-core'
import type { NodeIOField, WorkflowDefinition } from '@ihxy/workflow-core'
import type { NodeRegistry } from '../core/registry'

export { listAncestorNodeIds } from '@ihxy/workflow-core'

export interface VariableRef {
  nodeId: string
  nodeLabel: string
  path: string
  type: string
  expression: string
}

function flattenOutputs(prefix: string, fields: NodeIOField[]): Array<{ path: string; type: string }> {
  return fields.map(field => ({
    path: prefix ? `${prefix}.${field.name}` : field.name,
    type: field.type,
  }))
}

export function listUpstreamVariables(
  workflow: WorkflowDefinition,
  nodeId: string,
  registry: NodeRegistry,
): VariableRef[] {
  const nodeMap = new Map(workflow.nodes.map(node => [node.id, node]))
  const refs: VariableRef[] = []
  for (const ancestorId of listAncestorNodeIds(workflow, nodeId)) {
    const node = nodeMap.get(ancestorId)
    if (!node) {
      continue
    }
    const definition = registry.get(node.type)
    const outputs = definition?.outputs ?? []
    const label = typeof node.data.label === 'string' && node.data.label
      ? node.data.label
      : definition?.label ?? node.type
    const fields = flattenOutputs(ancestorId, outputs)
    for (const field of fields) {
      refs.push({
        nodeId: ancestorId,
        nodeLabel: label,
        path: field.path,
        type: field.type,
        expression: `{{ ${field.path} }}`,
      })
    }
  }
  return refs
}
