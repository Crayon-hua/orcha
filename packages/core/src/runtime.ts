import { parseNodeCatalog } from './catalog'
import { parseWorkflow } from './json'
import type { NodeCatalog, RuntimePayload, WorkflowDefinition } from './types'
import { validateWorkflowAgainstCatalog } from './validate'

export function toRuntimePayload(
  workflow: WorkflowDefinition,
  catalog: NodeCatalog,
): RuntimePayload {
  const parsedWorkflow = parseWorkflow(workflow)
  const parsedCatalog = parseNodeCatalog(catalog)
  validateWorkflowAgainstCatalog(parsedWorkflow, parsedCatalog)
  return {
    workflow: parsedWorkflow,
    catalog: parsedCatalog,
  }
}
