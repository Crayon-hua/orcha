<script setup lang="ts">
import { ref } from 'vue'
import { parseWorkflow, removeSelectionCommand, replaceWorkflowCommand, serializeWorkflow } from '../core'
import { useEditorContext } from './context'

defineProps<{
  canUndo: boolean
  canRedo: boolean
}>()

const emit = defineEmits<{
  'update:readonly': [value: boolean]
}>()

const { document, readonly, commands, getCanvas } = useEditorContext()
const fileRef = ref<HTMLInputElement | null>(null)
const error = ref('')

function deleteSelected(): void {
  if (readonly.value) {
    return
  }
  const canvas = getCanvas()
  if (!canvas) {
    return
  }
  const nodeIds = canvas.getSelectedNodeIds()
  const edgeIds = canvas.getSelectedEdgeIds()
  if (!nodeIds.length && !edgeIds.length) {
    return
  }
  commands.execute(removeSelectionCommand(document, nodeIds, edgeIds))
}

function toggleReadonly(): void {
  emit('update:readonly', !readonly.value)
}

function pickFile(): void {
  error.value = ''
  fileRef.value?.click()
}

function onExport(): void {
  const viewport = getCanvas()?.getViewport()
  const workflow = { ...document.snapshot(), viewport }
  const blob = new Blob([serializeWorkflow(workflow)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = `${workflow.name || 'workflow'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const workflow = parseWorkflow(String(reader.result ?? ''))
      commands.execute(replaceWorkflowCommand(document, workflow))
      error.value = ''
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '导入失败'
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <header class="sw-toolbar">
    <span class="sw-toolbar__title">工作流设计器</span>
    <button type="button" class="sw-btn" :disabled="!canUndo || readonly" @click="commands.undo()">撤销</button>
    <button type="button" class="sw-btn" :disabled="!canRedo || readonly" @click="commands.redo()">重做</button>
    <button type="button" class="sw-btn sw-btn--danger" :disabled="readonly" @click="deleteSelected">删除</button>
    <button type="button" class="sw-btn" @click="getCanvas()?.fitView({ padding: 0.2 })">适应画布</button>
    <span class="sw-toolbar__spacer" />
    <button type="button" class="sw-btn" :disabled="readonly" @click="pickFile">导入 JSON</button>
    <button type="button" class="sw-btn" @click="onExport">导出 JSON</button>
    <button type="button" class="sw-btn" :class="{ 'sw-btn--primary': readonly }" @click="toggleReadonly">
      {{ readonly ? '退出只读' : '只读' }}
    </button>
    <span v-if="error" class="sw-toast">{{ error }}</span>
    <input
      ref="fileRef"
      type="file"
      accept="application/json,.json"
      hidden
      @change="onFileChange"
    >
  </header>
</template>
