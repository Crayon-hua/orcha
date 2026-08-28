import { defineNodeType, registerNodeTypes } from '../registry/node-registry'
import ConditionNode from '../nodes/ConditionNode.vue'
import EndNode from '../nodes/EndNode.vue'
import StartNode from '../nodes/StartNode.vue'
import TaskNode from '../nodes/TaskNode.vue'

export const builtinNodeTypes = [
  defineNodeType({
    type: 'start',
    label: '开始',
    component: StartNode,
    palette: { group: '基础', description: '流程入口' },
    fields: [{ key: 'label', label: '名称', type: 'text', placeholder: '开始' }],
    handles: { source: true },
    defaultData: { label: '开始' },
  }),
  defineNodeType({
    type: 'end',
    label: '结束',
    component: EndNode,
    palette: { group: '基础', description: '流程出口' },
    fields: [{ key: 'label', label: '名称', type: 'text', placeholder: '结束' }],
    handles: { target: true },
    defaultData: { label: '结束' },
  }),
  defineNodeType({
    type: 'task',
    label: '任务',
    component: TaskNode,
    palette: { group: '基础', description: '执行一步业务' },
    fields: [
      { key: 'label', label: '名称', type: 'text', placeholder: '任务' },
      { key: 'description', label: '描述', type: 'textarea', placeholder: '任务说明' },
    ],
    handles: { target: true, source: true },
    defaultData: { label: '任务', description: '' },
  }),
  defineNodeType({
    type: 'condition',
    label: '条件',
    component: ConditionNode,
    palette: { group: '基础', description: '按条件分支' },
    fields: [
      { key: 'label', label: '名称', type: 'text', placeholder: '条件' },
      { key: 'expression', label: '表达式', type: 'textarea', placeholder: '例如 status === "ok"' },
    ],
    handles: {
      target: true,
      sources: [
        { id: 'true', label: '是', position: 'right' },
        { id: 'false', label: '否', position: 'right' },
      ],
    },
    defaultData: { label: '条件', expression: '' },
  }),
]

registerNodeTypes(builtinNodeTypes)
