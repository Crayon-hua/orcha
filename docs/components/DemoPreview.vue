<script setup lang="ts">
import { ref } from 'vue'
import {
  defineNodeType,
  WorkflowDesigner,
  type WorkflowDefinition,
} from '@ihxy/orcha-editor'
import ApprovalNode from './ApprovalNode.vue'
import { sampleWorkflow } from './sample-workflow'

const extraTypes = [
  defineNodeType({
    type: 'approval',
    label: '审批',
    component: ApprovalNode,
    palette: { group: '扩展', description: '自定义节点示例' },
    fields: [
      { key: 'label', label: '名称', type: 'text', placeholder: '审批' },
      { key: 'approver', label: '审批人', type: 'text', placeholder: '例如 张三' },
    ],
    handles: { target: true, source: true },
    defaultData: { label: '审批', approver: '' },
  }),
]

defineProps<{
  fill?: boolean
}>()

const readonly = ref(false)
const workflow = ref<WorkflowDefinition>(JSON.parse(JSON.stringify(sampleWorkflow)) as WorkflowDefinition)
</script>

<template>
  <div class="demo-preview" :class="{ 'is-fill': fill }">
    <div class="demo-preview__paper">
      <WorkflowDesigner
        v-model="workflow"
        v-model:readonly="readonly"
        :node-types="extraTypes"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-preview {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.demo-preview__paper {
  box-sizing: border-box;
  width: 100%;
  height: min(74vh, 800px);
  min-height: 640px;
  overflow: hidden;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #d1d9e0);
  border-radius: 16px;
  box-shadow: 0 18px 50px rgb(15 23 42 / 8%);
}

.demo-preview__paper :deep(.sw-designer) {
  border: none;
  border-radius: 0;
}

@media (width < 640px) {
  .demo-preview__paper {
    height: min(78vh, 640px);
    min-height: 480px;
    border-radius: 12px;
  }
}

.demo-preview.is-fill,
.demo-preview.is-fill .demo-preview__paper {
  height: 100%;
  min-height: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.demo-preview.is-fill :deep(.sw-designer) {
  height: 100%;
}
</style>
