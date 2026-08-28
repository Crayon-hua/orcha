import type { WorkflowDefinition } from './types'

function incomingSources(workflow: WorkflowDefinition, nodeId: string): string[] {
  return workflow.edges
    .filter(edge => edge.target === nodeId)
    .map(edge => edge.source)
}

export function listAncestorNodeIds(workflow: WorkflowDefinition, nodeId: string): string[] {
  const visited = new Set<string>()
  const stack = incomingSources(workflow, nodeId)
  while (stack.length) {
    const current = stack.pop()
    if (!current || visited.has(current)) {
      continue
    }
    visited.add(current)
    for (const source of incomingSources(workflow, current)) {
      stack.push(source)
    }
  }
  return [...visited]
}
