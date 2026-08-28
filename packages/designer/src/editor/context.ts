import { inject, provide, type Ref } from 'vue'
import { EDITOR_CONTEXT_KEY } from '../core/types'
import type { EditorContext } from '../plugins/types'

export function provideEditorContext(context: EditorContext): void {
  provide(EDITOR_CONTEXT_KEY, context)
}

export function useEditorContext(): EditorContext {
  const context = inject<EditorContext>(EDITOR_CONTEXT_KEY)
  if (!context) {
    throw new Error('useEditorContext 必须在 WorkflowDesigner 内使用')
  }
  return context
}

export function useFlowId(): string {
  return useEditorContext().flowId
}

export function useNodeRegistry() {
  return useEditorContext().registry
}

export function useReadonly(): Ref<boolean> {
  return useEditorContext().readonly
}
