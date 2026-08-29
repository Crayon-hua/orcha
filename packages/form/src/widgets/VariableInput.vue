<script setup lang="ts">
import { computed } from 'vue'
import type { VariableRef } from '@ihxy/orcha-variable'

const props = defineProps<{
  id: string
  modelValue: string
  placeholder?: string
  disabled?: boolean
  variables?: VariableRef[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const grouped = computed(() => {
  const map = new Map<string, VariableRef[]>()
  for (const item of props.variables ?? []) {
    const list = map.get(item.nodeId) ?? []
    list.push(item)
    map.set(item.nodeId, list)
  }
  return [...map.entries()]
})

function insert(expression: string): void {
  const current = props.modelValue ?? ''
  const next = current ? `${current} ${expression}` : expression
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="sw-variable-input">
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <div v-if="grouped.length && !disabled" class="sw-variable-input__list">
      <div class="sw-variable-input__hint">上游输出</div>
      <section v-for="[nodeId, items] in grouped" :key="nodeId" class="sw-variable-input__group">
        <div class="sw-variable-input__node">{{ items[0]?.nodeLabel }} · {{ nodeId }}</div>
        <button
          v-for="item in items"
          :key="item.path"
          type="button"
          class="sw-variable-input__item"
          @click="insert(item.expression)"
        >
          {{ item.expression }}
          <span class="sw-variable-input__type">{{ item.type }}</span>
        </button>
      </section>
    </div>
    <p v-else-if="!disabled" class="sw-variable-input__empty">暂无上游输出，连接前置节点后可插入变量。</p>
  </div>
</template>
