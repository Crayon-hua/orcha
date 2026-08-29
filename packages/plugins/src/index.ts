import { copyPastePlugin } from './copy-paste'
import { historyPlugin } from './history'
import { keyboardPlugin } from './keyboard'
import type { WorkflowPlugin } from './types'

export { copyPastePlugin, getClipboardActions } from './copy-paste'
export { historyPlugin } from './history'
export { handleEditorKeydown, keyboardPlugin } from './keyboard'
export { createWorkflowEditor } from './types'
export type { CanvasHandle, EditorContext, WorkflowPlugin } from './types'
export {
  EDITOR_CONTEXT_KEY,
  provideEditorContext,
  useEditorContext,
  useFlowId,
  useNodeRegistry,
  useReadonly,
} from './context'

export function defaultEditorPlugins(): WorkflowPlugin[] {
  return [historyPlugin(), copyPastePlugin(), keyboardPlugin()]
}
