<script setup lang="ts">
import { computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { resolveFormSchema } from '../core/registry'
import { setNameCommand, updateNodeDataCommand } from '../core'
import FormRenderer from '../form/FormRenderer.vue'
import { listUpstreamVariables } from '../variable/scope'
import { useEditorContext } from './context'

const { flowId, document, registry, readonly, commands, revision } = useEditorContext()
const { getSelectedNodes } = useVueFlow({ id: flowId })

const selected = computed(() => getSelectedNodes.value[0])
const definition = computed(() =>
  selected.value ? registry.get(selected.value.type ?? '') : undefined,
)
const schema = computed(() =>
  definition.value ? resolveFormSchema(definition.value) : { fields: [] },
)
const values = computed(() => (selected.value?.data ?? {}) as Record<string, unknown>)
const workflowName = computed(() => {
  void revision.value
  return document.snapshot().name ?? ''
})
const variables = computed(() => {
  void revision.value
  if (!selected.value) {
    return []
  }
  return listUpstreamVariables(document.snapshot(), selected.value.id, registry)
})

function onFormChange(key: string, value: unknown): void {
  if (!selected.value || readonly.value) {
    return
  }
  commands.execute(updateNodeDataCommand(document, selected.value.id, { [key]: value }))
}

function onNameInput(event: Event): void {
  if (readonly.value) {
    return
  }
  commands.execute(setNameCommand(document, (event.target as HTMLInputElement).value))
}
</script>

<template>
  <aside class="sw-props">
    <h2 class="sw-panel__title">属性</h2>

    <template v-if="selected && definition">
      <div class="sw-props__type">{{ definition.label }} · {{ selected.id }}</div>
      <FormRenderer
        :schema="schema"
        :values="values"
        :disabled="readonly"
        :variables="variables"
        @change="onFormChange"
      />
    </template>

    <template v-else>
      <p class="sw-props__empty">未选中节点，可编辑流程名称。</p>
      <div class="sw-field">
        <label for="sw-workflow-name">流程名称</label>
        <input
          id="sw-workflow-name"
          :value="workflowName"
          :disabled="readonly"
          placeholder="未命名流程"
          @input="onNameInput"
        >
      </div>
    </template>
  </aside>
</template>
