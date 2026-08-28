<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'
import { useFlowId, useNodeRegistry, useReadonly } from '../composables/useFlowContext'

const props = defineProps<{
  workflowName: string
}>()

const emit = defineEmits<{
  'update:workflowName': [value: string]
  change: []
}>()

const flowId = useFlowId()
const registry = useNodeRegistry()
const readonly = useReadonly()
const { getSelectedNodes, updateNodeData } = useVueFlow({ id: flowId })

const selected = computed(() => getSelectedNodes.value[0])
const definition = computed(() =>
  selected.value ? registry.get(selected.value.type ?? '') : undefined,
)

function fieldValue(key: string): string {
  const data = selected.value?.data as Record<string, unknown> | undefined
  const value = data?.[key]
  return value == null ? '' : String(value)
}

function onFieldInput(key: string, event: Event): void {
  if (!selected.value || readonly.value) {
    return
  }
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const raw = target.value
  const next = target instanceof HTMLInputElement && target.type === 'number'
    ? Number(raw)
    : raw
  updateNodeData(selected.value.id, { [key]: next })
  emit('change')
}
</script>

<template>
  <aside class="sw-props">
    <h2 class="sw-panel__title">属性</h2>

    <template v-if="selected && definition">
      <div class="sw-props__type">{{ definition.label }} · {{ selected.id }}</div>
      <div class="sw-props__fields">
        <div v-for="field in definition.fields ?? []" :key="field.key" class="sw-field">
          <label :for="`sw-field-${field.key}`">{{ field.label }}</label>
          <textarea
            v-if="field.type === 'textarea'"
            :id="`sw-field-${field.key}`"
            :value="fieldValue(field.key)"
            :placeholder="field.placeholder"
            :disabled="readonly"
            @input="onFieldInput(field.key, $event)"
          />
          <select
            v-else-if="field.type === 'select'"
            :id="`sw-field-${field.key}`"
            :value="fieldValue(field.key)"
            :disabled="readonly"
            @change="onFieldInput(field.key, $event)"
          >
            <option v-for="option in field.options ?? []" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input
            v-else
            :id="`sw-field-${field.key}`"
            :type="field.type === 'number' ? 'number' : 'text'"
            :value="fieldValue(field.key)"
            :placeholder="field.placeholder"
            :disabled="readonly"
            @input="onFieldInput(field.key, $event)"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <p class="sw-props__empty">未选中节点，可编辑流程名称。</p>
      <div class="sw-field">
        <label for="sw-workflow-name">流程名称</label>
        <input
          id="sw-workflow-name"
          :value="props.workflowName"
          :disabled="readonly"
          placeholder="未命名流程"
          @input="emit('update:workflowName', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </template>
  </aside>
</template>
