<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: Record<string, unknown> & { label?: string; expression?: string }
  selected?: boolean
}>()
</script>

<template>
  <div class="sw-node sw-node--condition" :class="{ 'is-selected': selected }">
    <Handle id="target" type="target" :position="Position.Left" />
    <div class="sw-node__head">条件</div>
    <div class="sw-node__title">{{ data.label || '条件' }}</div>
    <div v-if="data.expression" class="sw-node__desc">{{ data.expression }}</div>
    <div class="sw-node__branches">
      <span>是</span>
      <span>否</span>
    </div>
    <Handle id="true" type="source" :position="Position.Right" :style="{ top: '38%' }" />
    <Handle id="false" type="source" :position="Position.Right" :style="{ top: '72%' }" />
  </div>
</template>
