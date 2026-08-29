<script setup lang="ts">
import { Handle, Position } from '@ihxy/orcha-vue'

defineProps<{
  data: Record<string, unknown> & { label?: string }
  selected?: boolean
}>()
</script>

<template>
  <div class="sw-node sw-node--end" :class="{ 'is-selected': selected }">
    <Handle id="target" type="target" :position="Position.Left" />
    <span class="sw-node__dot sw-node__dot--end" />
    <span class="sw-node__label">{{ data.label || '结束' }}</span>
  </div>
</template>
