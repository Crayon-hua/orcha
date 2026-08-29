<script setup lang="ts">
import { Handle, Position } from '@ihxy/orcha-vue'

defineProps<{
  data: Record<string, unknown> & { label?: string }
  selected?: boolean
}>()
</script>

<template>
  <div class="sw-node sw-node--start" :class="{ 'is-selected': selected }">
    <span class="sw-node__dot" />
    <span class="sw-node__label">{{ data.label || '开始' }}</span>
    <Handle id="source" type="source" :position="Position.Right" />
  </div>
</template>
