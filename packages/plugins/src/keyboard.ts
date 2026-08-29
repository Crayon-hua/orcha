import { removeSelectionCommand } from '@ihxy/orcha-core'
import { getClipboardActions } from './copy-paste'
import type { EditorContext, WorkflowPlugin } from './types'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
}

export function handleEditorKeydown(context: EditorContext, event: KeyboardEvent): void {
  if (isTypingTarget(event.target)) {
    return
  }
  const meta = event.ctrlKey || event.metaKey
  const key = event.key.toLowerCase()
  const { copy, paste } = getClipboardActions(context)

  if (meta && key === 'z') {
    event.preventDefault()
    if (context.readonly.value) {
      return
    }
    if (event.shiftKey) {
      context.commands.redo()
    }
    else {
      context.commands.undo()
    }
    return
  }

  if (meta && key === 'y') {
    event.preventDefault()
    if (!context.readonly.value) {
      context.commands.redo()
    }
    return
  }

  if (meta && key === 'c') {
    event.preventDefault()
    copy()
    return
  }

  if (meta && key === 'v') {
    event.preventDefault()
    if (!context.readonly.value) {
      paste()
    }
    return
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (context.readonly.value) {
      return
    }
    const canvas = context.getCanvas()
    if (!canvas) {
      return
    }
    const nodeIds = canvas.getSelectedNodeIds()
    const edgeIds = canvas.getSelectedEdgeIds()
    if (!nodeIds.length && !edgeIds.length) {
      return
    }
    event.preventDefault()
    context.commands.execute(removeSelectionCommand(context.document, nodeIds, edgeIds))
  }
}

export function keyboardPlugin(): WorkflowPlugin {
  return {
    name: 'keyboard',
    install() {},
  }
}
