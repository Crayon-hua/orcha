export interface TemplateSegment {
  type: 'text' | 'expression'
  value: string
}

const TEMPLATE_RE = /\{\{\s*([^}]+?)\s*\}\}/g

export function parseTemplate(text: string): TemplateSegment[] {
  const segments: TemplateSegment[] = []
  let lastIndex = 0
  TEMPLATE_RE.lastIndex = 0
  let match = TEMPLATE_RE.exec(text)
  while (match) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'expression', value: match[1].trim() })
    lastIndex = match.index + match[0].length
    match = TEMPLATE_RE.exec(text)
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return segments
}

export function extractTemplateExpressions(text: string): string[] {
  return parseTemplate(text)
    .filter(segment => segment.type === 'expression')
    .map(segment => segment.value)
}

export function toTemplateExpression(path: string): string {
  return `{{ ${path} }}`
}
