<script setup lang="ts">
import { ref } from 'vue'
import {
  defineNodeType,
  WorkflowDesigner,
  type WorkflowDefinition,
} from '@ihxy/smart-workflow-designer'
import ApprovalNode from './ApprovalNode.vue'

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

const workflow = ref<WorkflowDefinition>({
  version: '1.0',
  name: '示例请假流程',
  nodes: [
    { id: 'start_1', type: 'start', position: { x: 40, y: 160 }, data: { label: '开始' } },
    { id: 'task_1', type: 'task', position: { x: 240, y: 140 }, data: { label: '填写申请', description: '提交请假信息' } },
    { id: 'cond_1', type: 'condition', position: { x: 500, y: 140 }, data: { label: '是否超过 3 天', expression: 'days > 3' } },
    { id: 'end_1', type: 'end', position: { x: 780, y: 80 }, data: { label: '结束' } },
    { id: 'end_2', type: 'end', position: { x: 780, y: 240 }, data: { label: '驳回结束' } },
  ],
  edges: [
    { id: 'e1', source: 'start_1', target: 'task_1', sourceHandle: 'source', targetHandle: 'target' },
    { id: 'e2', source: 'task_1', target: 'cond_1', sourceHandle: 'source', targetHandle: 'target' },
    { id: 'e3', source: 'cond_1', target: 'end_1', sourceHandle: 'true', targetHandle: 'target', label: '是' },
    { id: 'e4', source: 'cond_1', target: 'end_2', sourceHandle: 'false', targetHandle: 'target', label: '否' },
  ],
})
</script>

<template>
  <div class="pg">
    <WorkflowDesigner
      v-model="workflow"
      v-model:readonly="readonly"
      :node-types="extraTypes"
    />
  </div>
</template>

<style>
.pg {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
