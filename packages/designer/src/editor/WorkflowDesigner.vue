<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import {
  addEdgeCommand,
  addNodeCommand,
  createCommandStack,
  createId,
  createMergedRegistry,
  createWorkflowDocument,
  parseWorkflow,
  serializeWorkflow,
  setNodePositionsCommand,
  type NodeTypeDefinition,
  type WorkflowDefinition,
} from '../core'
import {
  createWorkflowEditor,
  defaultEditorPlugins,
  handleEditorKeydown,
  type CanvasHandle,
  type WorkflowPlugin,
} from '../plugins'
import { flowFromWorkflow, type FlowEdgeLike, type FlowNodeLike } from '../vue/adapter'
import WorkflowCanvas from '../vue/WorkflowCanvas.vue'
import { provideEditorContext } from './context'
import DesignerToolbar from './DesignerToolbar.vue'
import NodePalette from './NodePalette.vue'
import PropertyPanel from './PropertyPanel.vue'

const props = withDefaults(defineProps<{
  modelValue: WorkflowDefinition
  nodeTypes?: NodeTypeDefinition[]
  readonly?: boolean
  flowId?: string
  plugins?: WorkflowPlugin[]
}>(), {
  nodeTypes: () => [],
  readonly: false,
  plugins: () => [],
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

const initial = parseWorkflow(props.modelValue)
if (!initial.id) {
  initial.id = createId('wf')
}
const workflowDocument = createWorkflowDocument(initial)
const commands = createCommandStack()
const revision = ref(0)
const applyingExternal = ref(false)
const dragging = ref(false)
const canvasRef = ref<CanvasHandle | null>(null)
const editor = createWorkflowEditor({
  flowId: flowId.value,
  document: workflowDocument,
  registry,
  readonly: readonlyState,
  commands,
  revision,
  getCanvas: () => canvasRef.value,
  plugins: [...defaultEditorPlugins(), ...props.plugins],
})

provideEditorContext(editor.context)
onBeforeUnmount(() => {
  editor.dispose()
})

const mapped = flowFromWorkflow(workflowDocument.snapshot())
const nodes = ref<FlowNodeLike[]>(mapped.nodes)
const edges = ref<FlowEdgeLike[]>(mapped.edges)

const canUndo = computed(() => {
  void revision.value
  return commands.canUndo
})
const canRedo = computed(() => {
  void revision.value
  return commands.canRedo
})

function emitToHost(): void {
  const snapshot = workflowDocument.snapshot()
  const viewport = canvasRef.value?.getViewport() ?? snapshot.viewport
  const workflow: WorkflowDefinition = { ...snapshot, viewport }
  applyingExternal.value = true
  emit('update:modelValue', workflow)
  emit('change', workflow)
  queueMicrotask(() => {
    applyingExternal.value = false
  })
}

function projectFromDocument(): void {
  const selectedIds = new Set(canvasRef.value?.getSelectedNodeIds() ?? [])
  const selectedEdgeIds = new Set(canvasRef.value?.getSelectedEdgeIds() ?? [])
  const next = flowFromWorkflow(workflowDocument.snapshot())
  nodes.value = next.nodes.map(node => ({
    ...node,
    selected: selectedIds.has(node.id),
  }))
  edges.value = next.edges.map(edge => ({
    ...edge,
    selected: selectedEdgeIds.has(edge.id),
  }))
}

workflowDocument.subscribe(() => {
  revision.value += 1
  if (dragging.value) {
    return
  }
  projectFromDocument()
  emitToHost()
})

commands.subscribe(() => {
  revision.value += 1
})

watch(
  () => props.modelValue,
  (workflow) => {
    if (applyingExternal.value) {
      return
    }
    const incoming = serializeWorkflow(parseWorkflow(workflow), false)
    const current = serializeWorkflow(workflowDocument.snapshot(), false)
    if (incoming === current) {
      return
    }
    applyingExternal.value = true
    workflowDocument.load(parseWorkflow(workflow))
    const viewport = workflowDocument.snapshot().viewport
    queueMicrotask(() => {
      if (viewport) {
        canvasRef.value?.setViewport(viewport)
      }
      applyingExternal.value = false
    })
  },
)

function onAddNode(payload: { type: string; position: { x: number; y: number } }): void {
  if (readonlyState.value) {
    return
  }
  const definition = registry.get(payload.type)
  if (!definition) {
    return
  }
  commands.execute(addNodeCommand(workflowDocument, {
    id: createId('n'),
    type: payload.type,
    position: payload.position,
    data: { ...definition.defaultData },
  }))
}

function onConnect(
  connection: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null },
  label?: string,
): void {
  if (readonlyState.value) {
    return
  }
  commands.execute(addEdgeCommand(workflowDocument, {
    id: createId('e'),
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    label,
  }))
}

function onNodeDragStart(): void {
  dragging.value = true
}

function onNodeDragStop(): void {
  dragging.value = false
  if (readonlyState.value) {
    return
  }
  const viewNodes = canvasRef.value?.getViewNodes() ?? nodes.value
  commands.execute(setNodePositionsCommand(
    workflowDocument,
    viewNodes.map(node => ({ id: node.id, x: node.position.x, y: node.position.y })),
  ))
}

function onMoveEnd(): void {
  if (applyingExternal.value) {
    return
  }
  const viewport = canvasRef.value?.getViewport()
  if (viewport) {
    workflowDocument.setViewport(viewport, true)
    emitToHost()
  }
}

function onReadonly(value: boolean): void {
  readonlyState.value = value
  emit('update:readonly', value)
}

function onKeydown(event: KeyboardEvent): void {
  handleEditorKeydown(editor.context, event)
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
      @update:readonly="onReadonly"
    />
    <NodePalette />
    <WorkflowCanvas
      ref="canvasRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      @add-node="onAddNode"
      @connect="onConnect"
      @node-drag-start="onNodeDragStart"
      @node-drag-stop="onNodeDragStop"
      @move-end="onMoveEnd"
    />
    <PropertyPanel />
  </div>
</template>
