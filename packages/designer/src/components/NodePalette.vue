<script setup lang="ts">
import { computed } from 'vue'
import { useNodeRegistry, useReadonly } from '../composables/useFlowContext'
import { listNodeTypes } from '../registry/node-registry'
import { DND_MIME } from '../types/workflow'

const registry = useNodeRegistry()
const readonly = useReadonly()

const groups = computed(() => {
  const map = new Map<string, ReturnType<typeof listNodeTypes>>()
  for (const definition of listNodeTypes(registry)) {
    const group = definition.palette?.group ?? '其他'
    const list = map.get(group) ?? []
    list.push(definition)
    map.set(group, list)
  }
  return [...map.entries()]
})

function onDragStart(event: DragEvent, type: string): void {
  if (readonly.value) {
    event.preventDefault()
    return
  }
  event.dataTransfer?.setData(DND_MIME, type)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <aside class="sw-palette">
    <h2 class="sw-panel__title">节点</h2>
    <section v-for="[group, items] in groups" :key="group" class="sw-palette__group">
      <div class="sw-palette__group-name">{{ group }}</div>
      <button
        v-for="item in items"
        :key="item.type"
        type="button"
        class="sw-palette__item"
        :draggable="!readonly"
        @dragstart="onDragStart($event, item.type)"
      >
        <span class="sw-palette__item-label">{{ item.label }}</span>
        <span v-if="item.palette?.description" class="sw-palette__item-desc">
          {{ item.palette.description }}
        </span>
      </button>
    </section>
  </aside>
</template>
