import type { FormSchema } from '@ihxy/orcha-core'

export interface FormModel {
  schema: FormSchema
  values: Record<string, unknown>
  errors: Record<string, string>
  setValue: (key: string, value: unknown) => void
  validate: () => boolean
}

function isEmpty(value: unknown): boolean {
  return value == null || value === ''
}

export function createFormModel(
  schema: FormSchema,
  values: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void,
): FormModel {
  const errors: Record<string, string> = {}

  function validateField(key: string, value: unknown): string {
    const field = schema.fields.find(item => item.key === key)
    if (field?.required && isEmpty(value)) {
      return `${field.label}不能为空`
    }
    return ''
  }

  function validate(): boolean {
    for (const key of Object.keys(errors)) {
      delete errors[key]
    }
    let ok = true
    for (const field of schema.fields) {
      const message = validateField(field.key, values[field.key])
      if (message) {
        errors[field.key] = message
        ok = false
      }
    }
    return ok
  }

  return {
    schema,
    values,
    errors,
    setValue(key: string, value: unknown): void {
      values[key] = value
      const message = validateField(key, value)
      if (message) {
        errors[key] = message
      }
      else {
        delete errors[key]
      }
      onChange(key, value)
    },
    validate,
  }
}
