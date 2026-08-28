<script setup lang="ts">
import type { FormFieldSchema, FormSchema } from '../core/types'
import type { VariableRef } from '../variable/scope'
import NumberInput from './widgets/NumberInput.vue'
import SelectInput from './widgets/SelectInput.vue'
import StringInput from './widgets/StringInput.vue'
import TextareaInput from './widgets/TextareaInput.vue'
import VariableInput from './widgets/VariableInput.vue'

const props = defineProps<{
  schema: FormSchema
  values: Record<string, unknown>
  disabled?: boolean
  errors?: Record<string, string>
  variables?: VariableRef[]
}>()

const emit = defineEmits<{
  change: [key: string, value: unknown]
}>()

function fieldValue(field: FormFieldSchema): string | number {
  const value = props.values[field.key]
  if (field.type === 'number') {
    return typeof value === 'number' ? value : Number(value ?? Number.NaN)
  }
  return value == null ? '' : String(value)
}

function onUpdate(key: string, value: unknown): void {
  emit('change', key, value)
}
</script>

<template>
  <div class="sw-form">
    <div v-for="field in schema.fields" :key="field.key" class="sw-field">
      <label :for="`sw-field-${field.key}`">
        {{ field.label }}
        <span v-if="field.required" class="sw-field__req">*</span>
      </label>
      <VariableInput
        v-if="field.type === 'variable'"
        :id="`sw-field-${field.key}`"
        :model-value="String(fieldValue(field))"
        :placeholder="field.placeholder"
        :disabled="disabled"
        :variables="variables"
        @update:model-value="onUpdate(field.key, $event)"
      />
      <TextareaInput
        v-else-if="field.type === 'textarea'"
        :id="`sw-field-${field.key}`"
        :model-value="String(fieldValue(field))"
        :placeholder="field.placeholder"
        :disabled="disabled"
        @update:model-value="onUpdate(field.key, $event)"
      />
      <SelectInput
        v-else-if="field.type === 'select'"
        :id="`sw-field-${field.key}`"
        :model-value="String(fieldValue(field))"
        :options="field.options"
        :disabled="disabled"
        @update:model-value="onUpdate(field.key, $event)"
      />
      <NumberInput
        v-else-if="field.type === 'number'"
        :id="`sw-field-${field.key}`"
        :model-value="fieldValue(field)"
        :placeholder="field.placeholder"
        :disabled="disabled"
        @update:model-value="onUpdate(field.key, $event)"
      />
      <StringInput
        v-else
        :id="`sw-field-${field.key}`"
        :model-value="String(fieldValue(field))"
        :placeholder="field.placeholder"
        :disabled="disabled"
        @update:model-value="onUpdate(field.key, $event)"
      />
      <p v-if="errors?.[field.key]" class="sw-field__error">{{ errors[field.key] }}</p>
    </div>
  </div>
</template>
