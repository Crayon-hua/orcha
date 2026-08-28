<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: Record<string, unknown> & { label?: string; approver?: string }
  selected?: boolean
}>()
</script>

<template>
  <div class="approval-node" :class="{ 'is-selected': selected }">
    <Handle id="target" type="target" :position="Position.Left" />
    <div class="approval-node__head">审批</div>
    <div class="approval-node__title">{{ data.label || '审批' }}</div>
    <div class="approval-node__meta">{{ data.approver || '未指定审批人' }}</div>
    <Handle id="source" type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.approval-node {
  min-width: 140px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #c4b5fd;
  border-top: 3px solid #7c3aed;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 6%);
}

.approval-node.is-selected {
  box-shadow: 0 0 0 3px #ede9fe;
}

.approval-node__head {
  margin-bottom: 4px;
  color: #7c3aed;
  font-size: 11px;
}

.approval-node__title {
  font-weight: 650;
  font-size: 13px;
}

.approval-node__meta {
  margin-top: 4px;
  color: #64748b;
  font-size: 11px;
}
</style>
