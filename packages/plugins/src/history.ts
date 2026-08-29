import type { EditorContext, WorkflowPlugin } from './types'

export function historyPlugin(): WorkflowPlugin {
  return {
    name: 'history',
    install(context: EditorContext) {
      return () => {
        context.commands.clear()
      }
    },
  }
}
