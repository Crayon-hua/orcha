<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import { useFlowId, useReadonly } from '../composables/useFlowContext'
import type { WorkflowDefinition } from '../types/workflow'
import { parseWorkflow } from '../utils/workflow'

defineProps<{
  canUndo: boolean
  canRedo: boolean
}>()

const emit = defineEmits<{
  undo: []
  redo: []
  imported: [workflow: WorkflowDefinition]
  export: []
  'update:readonly': [value: boolean]
}>()

const flowId = useFlowId()
const readonly = useReadonly()
const { fitView, getSelectedNodes, getSelectedEdges, removeNodes, removeEdges } = useVueFlow({ id: flowId })
const fileRef = ref<HTMLInputElement | null>(null)
const error = ref('')

function deleteSelected(): void {
  if (readonly.value) {
    return
  }
  const selectedNodes = getSelectedNodes.value
  const selectedEdges = getSelectedEdges.value
  if (selectedNodes.length) {
    removeNodes(selectedNodes, true)
  }
  if (selectedEdges.length) {
    removeEdges(selectedEdges)
  }
}

function toggleReadonly(): void {
  emit('update:readonly', !readonly.value)
}

function pickFile(): void {
  error.value = ''
  fileRef.value?.click()
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
      emit('imported', workflow)
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
    <button type="button" class="sw-btn" :disabled="!canUndo || readonly" @click="emit('undo')">撤销</button>
    <button type="button" class="sw-btn" :disabled="!canRedo || readonly" @click="emit('redo')">重做</button>
    <button type="button" class="sw-btn sw-btn--danger" :disabled="readonly" @click="deleteSelected">删除</button>
    <button type="button" class="sw-btn" @click="fitView({ padding: 0.2 })">适应画布</button>
    <span class="sw-toolbar__spacer" />
    <button type="button" class="sw-btn" :disabled="readonly" @click="pickFile">导入 JSON</button>
    <button type="button" class="sw-btn" @click="emit('export')">导出 JSON</button>
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
    />
  </header>
</template>
