import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { WorkflowDefinition } from '../types/workflow'
import { cloneWorkflow } from '../utils/workflow'

const MAX_HISTORY = 50

export function useHistory(current: Ref<WorkflowDefinition> | ComputedRef<WorkflowDefinition>) {
  const past = ref<WorkflowDefinition[]>([])
  const future = ref<WorkflowDefinition[]>([])

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  function record(previous: WorkflowDefinition): void {
    past.value.push(cloneWorkflow(previous))
    if (past.value.length > MAX_HISTORY) {
      past.value.shift()
    }
    future.value = []
  }

  function undo(): WorkflowDefinition | undefined {
    const prev = past.value.pop()
    if (!prev) {
      return undefined
    }
    future.value.push(cloneWorkflow(current.value))
    return prev
  }

  function redo(): WorkflowDefinition | undefined {
    const next = future.value.pop()
    if (!next) {
      return undefined
    }
    past.value.push(cloneWorkflow(current.value))
    return next
  }

  function clear(): void {
    past.value = []
    future.value = []
  }

  return { canUndo, canRedo, record, undo, redo, clear }
}
