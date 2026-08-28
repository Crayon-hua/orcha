<script setup lang="ts">
import type { ViewportTransform } from '@vue-flow/core'
import { computed, ref, useId, watch } from 'vue'
import { provideFlowContext } from '../composables/useFlowContext'
import { useHistory } from '../composables/useHistory'
import { createMergedRegistry } from '../registry/node-registry'
import type { NodeTypeDefinition, WorkflowDefinition } from '../types/workflow'
import { createId } from '../utils/id'
import {
  cloneWorkflow,
  flowFromWorkflow,
  serializeWorkflow,
  workflowFromFlow,
  type FlowEdgeLike,
  type FlowNodeLike,
} from '../utils/workflow'
import DesignerToolbar from './DesignerToolbar.vue'
import NodePalette from './NodePalette.vue'
import PropertyPanel from './PropertyPanel.vue'
import WorkflowCanvas from './WorkflowCanvas.vue'

const props = withDefaults(defineProps<{
  modelValue: WorkflowDefinition
  nodeTypes?: NodeTypeDefinition[]
  readonly?: boolean
  flowId?: string
}>(), {
  nodeTypes: () => [],
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: WorkflowDefinition]
  'update:readonly': [value: boolean]
  change: [value: WorkflowDefinition]
}>()

const generatedId = useId()
const flowId = computed(() => props.flowId || `sw-designer-${generatedId}`)
const registry = createMergedRegistry(props.nodeTypes)

const readonlyState = ref(props.readonly)
watch(() => props.readonly, (value) => {
  readonlyState.value = value
})

provideFlowContext({
  flowId: flowId.value,
  registry,
  readonly: readonlyState,
})

const initial = flowFromWorkflow(props.modelValue)
const nodes = ref<FlowNodeLike[]>(initial.nodes)
const edges = ref<FlowEdgeLike[]>(initial.edges)
const workflowName = ref(props.modelValue.name ?? '未命名流程')
const workflowId = ref(props.modelValue.id ?? createId('wf'))
const applyingExternal = ref(false)
const dragging = ref(false)
const canvasRef = ref<{
  getViewport: () => ViewportTransform
  setViewport: (viewport: ViewportTransform) => void
  getNodes: () => FlowNodeLike[]
  getEdges: () => FlowEdgeLike[]
} | null>(null)

const snapshot = computed((): WorkflowDefinition =>
  workflowFromFlow(nodes.value, edges.value, undefined, {
    id: workflowId.value,
    name: workflowName.value,
  }),
)

const { canUndo, canRedo, record, undo, redo } = useHistory(snapshot)

let lastGraphKey = graphKey(nodes.value, edges.value, workflowName.value)
let lastWorkflow = cloneWorkflow({
  ...props.modelValue,
  id: workflowId.value,
  name: workflowName.value,
})

function graphKey(currentNodes: FlowNodeLike[], currentEdges: FlowEdgeLike[], name: string): string {
  return JSON.stringify({
    name,
    nodes: currentNodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: currentEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edge.label,
    })),
  })
}

function currentWorkflow(): WorkflowDefinition {
  const flowNodes = canvasRef.value?.getNodes() ?? nodes.value
  const flowEdges = canvasRef.value?.getEdges() ?? edges.value
  return workflowFromFlow(flowNodes, flowEdges, canvasRef.value?.getViewport(), {
    id: workflowId.value,
    name: workflowName.value,
  })
}

function emitWorkflow(recordHistory: boolean): void {
  const flowNodes = canvasRef.value?.getNodes() ?? nodes.value
  const flowEdges = canvasRef.value?.getEdges() ?? edges.value
  const key = graphKey(flowNodes, flowEdges, workflowName.value)
  const workflow = workflowFromFlow(flowNodes, flowEdges, canvasRef.value?.getViewport(), {
    id: workflowId.value,
    name: workflowName.value,
  })
  if (recordHistory && key !== lastGraphKey) {
    record(lastWorkflow)
  }
  lastGraphKey = key
  lastWorkflow = cloneWorkflow(workflow)
  applyingExternal.value = true
  nodes.value = flowNodes
  edges.value = flowEdges
  emit('update:modelValue', workflow)
  emit('change', workflow)
  queueMicrotask(() => {
    applyingExternal.value = false
  })
}

function applyWorkflow(workflow: WorkflowDefinition, recordHistory: boolean): void {
  if (recordHistory) {
    record(lastWorkflow)
  }
  applyingExternal.value = true
  const mapped = flowFromWorkflow(workflow)
  nodes.value = mapped.nodes
  edges.value = mapped.edges
  workflowName.value = workflow.name ?? workflowName.value
  if (workflow.id) {
    workflowId.value = workflow.id
  }
  lastGraphKey = graphKey(nodes.value, edges.value, workflowName.value)
  lastWorkflow = cloneWorkflow({
    ...workflow,
    id: workflowId.value,
    name: workflowName.value,
  })
  emit('update:modelValue', cloneWorkflow(lastWorkflow))
  emit('change', cloneWorkflow(lastWorkflow))
  queueMicrotask(() => {
    applyingExternal.value = false
    if (mapped.viewport) {
      canvasRef.value?.setViewport(mapped.viewport)
    }
  })
}

watch(
  () => graphKey(nodes.value, edges.value, workflowName.value),
  () => {
    if (applyingExternal.value || dragging.value || readonlyState.value) {
      return
    }
    emitWorkflow(true)
  },
)

watch(
  () => props.modelValue,
  (workflow) => {
    if (applyingExternal.value) {
      return
    }
    applyWorkflow(workflow, false)
  },
)

function onNodeDragStart(): void {
  dragging.value = true
}

function onNodeDragStop(): void {
  dragging.value = false
  if (!readonlyState.value) {
    emitWorkflow(true)
  }
}

function onMoveEnd(): void {
  if (applyingExternal.value) {
    return
  }
  emitWorkflow(false)
}

function onNodeDataChange(): void {
  if (applyingExternal.value || readonlyState.value) {
    return
  }
  emitWorkflow(true)
}

function onUndo(): void {
  const prev = undo()
  if (prev) {
    applyWorkflow(prev, false)
  }
}

function onRedo(): void {
  const next = redo()
  if (next) {
    applyWorkflow(next, false)
  }
}

function onImported(workflow: WorkflowDefinition): void {
  applyWorkflow(workflow, true)
}

function onExport(): void {
  const workflow = currentWorkflow()
  const blob = new Blob([serializeWorkflow(workflow)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${workflow.name || 'workflow'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function onReadonly(value: boolean): void {
  readonlyState.value = value
  emit('update:readonly', value)
}

function onKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select')) {
    return
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      onRedo()
    }
    else {
      onUndo()
    }
  }
}
</script>

<template>
  <div
    class="sw-designer"
    :class="{ 'is-readonly': readonlyState }"
    tabindex="0"
    @keydown="onKeydown"
  >
    <DesignerToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      @undo="onUndo"
      @redo="onRedo"
      @imported="onImported"
      @export="onExport"
      @update:readonly="onReadonly"
    />
    <NodePalette />
    <WorkflowCanvas
      ref="canvasRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      @node-drag-start="onNodeDragStart"
      @node-drag-stop="onNodeDragStop"
      @move-end="onMoveEnd"
    />
    <PropertyPanel v-model:workflow-name="workflowName" @change="onNodeDataChange" />
  </div>
</template>
