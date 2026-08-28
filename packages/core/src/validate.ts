import { listSourcePortsFromConfig, listTargetPortsFromConfig } from './ports'
import { extractTemplateExpressions } from './template'
import { listAncestorNodeIds } from './graph'
import type { NodeCatalog, NodeTypeContract, WorkflowDefinition } from './types'

export class WorkflowValidationError extends Error {
  issues: string[]

  constructor(issues: string[]) {
    super(issues.join('；'))
    this.name = 'WorkflowValidationError'
    this.issues = issues
  }
}

const OUTPUT_REF_RE = /^([^.]+)\.([^.]+)$/

function collectExpressions(value: unknown, acc: string[]): void {
  if (typeof value === 'string') {
    acc.push(...extractTemplateExpressions(value))
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectExpressions(item, acc)
    }
    return
  }
  if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value)) {
      collectExpressions(item, acc)
    }
  }
}

function catalogMap(catalog: NodeCatalog): Map<string, NodeTypeContract> {
  return new Map(catalog.types.map(item => [item.type, item]))
}

function portIds(
  contract: NodeTypeContract,
  direction: 'source' | 'target',
): string[] {
  const ports = direction === 'source'
    ? listSourcePortsFromConfig(contract.ports)
    : listTargetPortsFromConfig(contract.ports)
  return ports.map(port => port.id).filter((id): id is string => Boolean(id))
}

export function validateWorkflowAgainstCatalog(
  workflow: WorkflowDefinition,
  catalog: NodeCatalog,
): void {
  const types = catalogMap(catalog)
  const issues: string[] = []
  const nodeMap = new Map(workflow.nodes.map(node => [node.id, node]))

  for (const node of workflow.nodes) {
    if (!types.has(node.type)) {
      issues.push(`未知节点类型: ${node.type}（节点 ${node.id}）`)
    }
  }

  for (const edge of workflow.edges) {
    const source = nodeMap.get(edge.source)
    const target = nodeMap.get(edge.target)
    if (!source || !target) {
      continue
    }
    const sourceContract = types.get(source.type)
    const targetContract = types.get(target.type)
    if (sourceContract && edge.sourceHandle) {
      const ids = portIds(sourceContract, 'source')
      if (!ids.includes(edge.sourceHandle)) {
        issues.push(`边 ${edge.id} 的 sourceHandle 不属于类型 ${source.type}: ${edge.sourceHandle}`)
      }
    }
    if (targetContract && edge.targetHandle) {
      const ids = portIds(targetContract, 'target')
      if (!ids.includes(edge.targetHandle)) {
        issues.push(`边 ${edge.id} 的 targetHandle 不属于类型 ${target.type}: ${edge.targetHandle}`)
      }
    }
  }

  for (const node of workflow.nodes) {
    const expressions: string[] = []
    collectExpressions(node.data, expressions)
    const ancestors = new Set(listAncestorNodeIds(workflow, node.id))
    for (const expression of expressions) {
      const match = OUTPUT_REF_RE.exec(expression)
      if (!match) {
        issues.push(`节点 ${node.id} 的表达式不是 nodeId.outputName: {{ ${expression} }}`)
        continue
      }
      const [, refNodeId, outputName] = match
      if (!ancestors.has(refNodeId)) {
        issues.push(`节点 ${node.id} 引用了非上游节点: ${refNodeId}`)
        continue
      }
      const upstream = nodeMap.get(refNodeId)
      const contract = upstream ? types.get(upstream.type) : undefined
      if (!contract?.outputs.some(field => field.name === outputName)) {
        issues.push(`未知输出: ${refNodeId}.${outputName}`)
      }
    }
  }

  if (issues.length) {
    throw new WorkflowValidationError(issues)
  }
}
