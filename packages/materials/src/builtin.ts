import { catalogFromNodeTypes } from '@ihxy/orcha-core'
import { defineNodeType, registerNodeTypes } from '@ihxy/orcha-vue'
import ConditionNode from './nodes/ConditionNode.vue'
import EndNode from './nodes/EndNode.vue'
import StartNode from './nodes/StartNode.vue'
import TaskNode from './nodes/TaskNode.vue'

export const builtinNodeTypes = [
  defineNodeType({
    type: 'start',
    label: '开始',
    component: StartNode,
    palette: { group: '基础', description: '流程入口', color: '#10b981' },
    form: {
      fields: [{ key: 'label', label: '名称', type: 'text', placeholder: '开始' }],
    },
    ports: { source: true },
    outputs: [{ name: 'trigger', type: 'any', description: '流程启动' }],
    defaultData: { label: '开始' },
  }),
  defineNodeType({
    type: 'end',
    label: '结束',
    component: EndNode,
    palette: { group: '基础', description: '流程出口', color: '#ef4444' },
    form: {
      fields: [{ key: 'label', label: '名称', type: 'text', placeholder: '结束' }],
    },
    ports: { target: true },
    inputs: [{ name: 'result', type: 'any', description: '流程结果' }],
    defaultData: { label: '结束' },
  }),
  defineNodeType({
    type: 'task',
    label: '任务',
    component: TaskNode,
    palette: { group: '基础', description: '执行一步业务', color: '#3b82f6' },
    form: {
      fields: [
        { key: 'label', label: '名称', type: 'text', placeholder: '任务' },
        { key: 'description', label: '描述', type: 'textarea', placeholder: '任务说明' },
      ],
    },
    ports: { target: true, source: true },
    inputs: [{ name: 'input', type: 'any' }],
    outputs: [{ name: 'result', type: 'object', description: '任务输出' }],
    defaultData: { label: '任务', description: '' },
  }),
  defineNodeType({
    type: 'condition',
    label: '条件',
    component: ConditionNode,
    palette: { group: '基础', description: '按条件分支', color: '#f59e0b' },
    form: {
      fields: [
        { key: 'label', label: '名称', type: 'text', placeholder: '条件' },
        { key: 'expression', label: '表达式', type: 'variable', placeholder: '{{ node.output }}' },
      ],
    },
    ports: {
      target: true,
      sources: [
        { id: 'true', label: '是', position: 'right' },
        { id: 'false', label: '否', position: 'right' },
      ],
    },
    inputs: [{ name: 'input', type: 'any' }],
    defaultData: { label: '条件', expression: '' },
  }),
]

registerNodeTypes(builtinNodeTypes)

export const builtinNodeCatalog = catalogFromNodeTypes(builtinNodeTypes)
