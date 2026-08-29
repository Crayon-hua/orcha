<script setup lang="ts">
import type { FormFieldOption } from '@ihxy/orcha-core'

defineProps<{
  id: string
  modelValue: string
  options?: FormFieldOption[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <select
    :id="id"
    :value="modelValue"
    :disabled="disabled"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option v-for="option in options ?? []" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
