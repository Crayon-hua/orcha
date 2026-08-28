<script setup lang="ts">
import { ref } from 'vue'
import {
  defineNodeType,
  WorkflowDesigner,
  type WorkflowDefinition,
} from 'smart-workflow-designer'
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

const readonly = ref(false)
const workflow = ref<WorkflowDefinition>(JSON.parse(JSON.stringify(sampleWorkflow)) as WorkflowDefinition)
</script>

<template>
  <div class="demo-preview">
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
  gap: 12px;
  align-items: stretch;
}

.demo-preview__paper {
  box-sizing: border-box;
  width: 100%;
  height: 560px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
}
</style>
