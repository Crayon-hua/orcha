<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Connection, GraphNode, ViewportTransform } from '@vue-flow/core'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'
import { DND_MIME } from '../core/types'
import { isConnectionAllowed, sourcePortLabel } from '../core/registry'
import { useEditorContext } from '../editor/context'
import type { CanvasHandle } from '../plugins/types'
import { toVueFlowNodeTypes, type FlowEdgeLike, type FlowNodeLike } from './adapter'

const nodes = defineModel<FlowNodeLike[]>('nodes', { required: true })
const edges = defineModel<FlowEdgeLike[]>('edges', { required: true })

const emit = defineEmits<{
  addNode: [payload: { type: string; position: { x: number; y: number } }]
  connect: [connection: Connection, label?: string]
  nodeDragStart: []
  nodeDragStop: []
  moveEnd: []
}>()

const context = useEditorContext()
const vueFlow = useVueFlow({ id: context.flowId })
const registry = context.registry
const readonly = context.readonly

const canvasHandle: CanvasHandle = {
  getViewport: () => vueFlow.getViewport(),
  setViewport: (viewport) => {
    void vueFlow.setViewport(viewport)
  },
  fitView: (options) => {
    void vueFlow.fitView(options)
  },
  getViewNodes: () => vueFlow.getNodes.value.map(node => ({
    id: node.id,
    type: node.type,
    position: { ...node.position },
    data: node.data as Record<string, unknown> | undefined,
  })),
  getViewEdges: () => vueFlow.getEdges.value.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  })),
  getSelectedNodeIds: () => vueFlow.getSelectedNodes.value.map(node => node.id),
  getSelectedEdgeIds: () => vueFlow.getSelectedEdges.value.map(edge => edge.id),
}

defineExpose({
  ...canvasHandle,
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
  const source = nodes.value.find(node => node.id === connection.source)
  const target = nodes.value.find(node => node.id === connection.target)
  if (!source || !target) {
    return false
  }
  const duplicate = edges.value.some(
    edge =>
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
  const source = nodes.value.find(node => node.id === connection.source)
  const definition = source ? registry.get(source.type ?? '') : undefined
  const label = definition ? sourcePortLabel(definition, connection.sourceHandle) : undefined
  emit('connect', connection, label)
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
  if (!type || !registry.get(type)) {
    return
  }
  const position = vueFlow.screenToFlowCoordinate({ x: event.clientX, y: event.clientY })
  emit('addNode', { type, position })
}

function miniMapColor(node: GraphNode): string {
  const definition = registry.get(node.type ?? '')
  return definition?.palette?.color ?? '#3b82f6'
}
</script>

<template>
  <div class="sw-canvas" @dragover="onDragOver" @drop="onDrop">
    <p v-if="showHint" class="sw-canvas__hint">从左侧拖拽节点到画布</p>
    <VueFlow
      :id="context.flowId"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-edge-options="defaultEdgeOptions"
      :nodes-draggable="!readonly"
      :nodes-connectable="!readonly"
      :elements-selectable="true"
      :edges-updatable="!readonly"
      :delete-key-code="null"
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
