import { inject, provide, type Ref } from 'vue'
import type { EditorContext } from './types'

export const EDITOR_CONTEXT_KEY = Symbol('orcha-editor')

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
