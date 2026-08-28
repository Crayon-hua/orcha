import { inject, provide, type Ref } from 'vue'
import type { NodeRegistry } from '../registry/node-registry'
import { FLOW_ID_KEY, READONLY_KEY, REGISTRY_KEY } from '../types/workflow'

export function provideFlowContext(options: {
  flowId: string
  registry: NodeRegistry
  readonly: Ref<boolean>
}): void {
  provide(FLOW_ID_KEY, options.flowId)
  provide(REGISTRY_KEY, options.registry)
  provide(READONLY_KEY, options.readonly)
}

export function useFlowId(): string {
  const id = inject<string>(FLOW_ID_KEY)
  if (!id) {
    throw new Error('useFlowId 必须在 WorkflowDesigner 内使用')
  }
  return id
}

export function useNodeRegistry(): NodeRegistry {
  const registry = inject<NodeRegistry>(REGISTRY_KEY)
  if (!registry) {
    throw new Error('useNodeRegistry 必须在 WorkflowDesigner 内使用')
  }
  return registry
}

export function useReadonly(): Ref<boolean> {
  const readonly = inject<Ref<boolean>>(READONLY_KEY)
  if (!readonly) {
    throw new Error('useReadonly 必须在 WorkflowDesigner 内使用')
  }
  return readonly
}

