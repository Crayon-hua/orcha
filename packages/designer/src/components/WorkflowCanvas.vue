<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Connection, GraphNode, ViewportTransform } from '@vue-flow/core'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'
import { useFlowId, useNodeRegistry, useReadonly } from '../composables/useFlowContext'
import { isConnectionAllowed, toVueFlowNodeTypes } from '../registry/node-registry'
import { DND_MIME } from '../types/workflow'
import { createId } from '../utils/id'
import type { FlowEdgeLike, FlowNodeLike } from '../utils/workflow'

const nodes = defineModel<FlowNodeLike[]>('nodes', { required: true })
const edges = defineModel<FlowEdgeLike[]>('edges', { required: true })

const emit = defineEmits<{
  nodeDragStart: []
  nodeDragStop: []
  moveEnd: []
}>()

const flowId = useFlowId()
const registry = useNodeRegistry()
const readonly = useReadonly()
const vueFlow = useVueFlow({ id: flowId })

defineExpose({
  getViewport: (): ViewportTransform => vueFlow.getViewport(),
  setViewport: (viewport: ViewportTransform) => vueFlow.setViewport(viewport),
  getNodes: (): FlowNodeLike[] => vueFlow.getNodes.value as FlowNodeLike[],
  getEdges: (): FlowEdgeLike[] => vueFlow.getEdges.value as FlowEdgeLike[],
})

const nodeTypes = computed(() => toVueFlowNodeTypes(registry))
const showHint = computed(() => nodes.value.length === 0)

const defaultEdgeOptions = {
  type: 'smoothstep' as const,
  markerEnd: MarkerType.ArrowClosed,
}

function isValidConnection(connection: Connection): boolean {
  if (readonly.value) {
    return false
  }
  if (connection.source === connection.target) {
    return false
  }
  const source = nodes.value.find((node) => node.id === connection.source)
  const target = nodes.value.find((node) => node.id === connection.target)
  if (!source || !target) {
    return false
  }
  const duplicate = edges.value.some(
    (edge) =>
      edge.source === connection.source
      && edge.target === connection.target
      && (edge.sourceHandle ?? null) === (connection.sourceHandle ?? null),
  )
  if (duplicate) {
    return false
  }
  return isConnectionAllowed(registry, source.type ?? '', target.type ?? '')
}

function onConnect(connection: Connection): boolean {
  if (!isValidConnection(connection)) {
    return false
  }
  const label =
    connection.sourceHandle === 'true'
      ? '是'
      : connection.sourceHandle === 'false'
        ? '否'
        : undefined
  vueFlow.addEdges({
    ...connection,
    id: createId('e'),
    label,
  })
  return true
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = readonly.value ? 'none' : 'move'
  }
}

function onDrop(event: DragEvent): void {
  event.preventDefault()
  if (readonly.value) {
    return
  }
  const type = event.dataTransfer?.getData(DND_MIME)
  if (!type) {
    return
  }
  const definition = registry.get(type)
  if (!definition) {
    return
  }
  const position = vueFlow.screenToFlowCoordinate({ x: event.clientX, y: event.clientY })
  vueFlow.addNodes({
    id: createId('n'),
    type,
    position,
    data: { ...definition.defaultData },
  })
}

function miniMapColor(node: GraphNode): string {
  if (node.type === 'start') return '#10b981'
  if (node.type === 'end') return '#ef4444'
  if (node.type === 'condition') return '#f59e0b'
  return '#3b82f6'
}
</script>

<template>
  <div class="sw-canvas" @dragover="onDragOver" @drop="onDrop">
    <p v-if="showHint" class="sw-canvas__hint">从左侧拖拽节点到画布</p>
    <VueFlow
      :id="flowId"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-edge-options="defaultEdgeOptions"
      :nodes-draggable="!readonly"
      :nodes-connectable="!readonly"
      :elements-selectable="true"
      :edges-updatable="!readonly"
      :delete-key-code="readonly ? null : ['Backspace', 'Delete']"
      :is-valid-connection="isValidConnection"
      :min-zoom="0.2"
      :max-zoom="2"
      fit-view-on-init
      @connect="onConnect"
      @node-drag-start="emit('nodeDragStart')"
      @node-drag-stop="emit('nodeDragStop')"
      @move-end="emit('moveEnd')"
    >
      <Background :gap="18" :size="1" />
      <Controls :show-interactive="false" />
      <MiniMap pannable zoomable :node-color="miniMapColor" />
    </VueFlow>
  </div>
</template>
