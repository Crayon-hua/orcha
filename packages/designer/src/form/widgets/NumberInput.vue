<script setup lang="ts">
defineProps<{
  id: string
  modelValue: number | string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  emit('update:modelValue', raw === '' ? Number.NaN : Number(raw))
}
</script>

<template>
  <input
    :id="id"
    :value="Number.isNaN(modelValue) ? '' : modelValue"
    type="number"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="onInput"
  >
</template>
