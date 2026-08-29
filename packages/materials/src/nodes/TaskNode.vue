<script setup lang="ts">
import { Handle, Position } from '@ihxy/orcha-vue'

defineProps<{
  data: Record<string, unknown> & { label?: string; description?: string }
  selected?: boolean
}>()
</script>

<template>
  <div class="sw-node sw-node--task" :class="{ 'is-selected': selected }">
    <Handle id="target" type="target" :position="Position.Left" />
    <div class="sw-node__head">任务</div>
    <div class="sw-node__title">{{ data.label || '任务' }}</div>
    <div v-if="data.description" class="sw-node__desc">{{ data.description }}</div>
    <Handle id="source" type="source" :position="Position.Right" />
  </div>
</template>
