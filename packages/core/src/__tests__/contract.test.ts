import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import Ajv2020, { type AnySchema } from 'ajv/dist/2020.js'
import {
  catalogFromNodeTypes,
  parseNodeCatalog,
  parseWorkflow,
  toRuntimePayload,
  validateWorkflowAgainstCatalog,
  WorkflowParseError,
  WorkflowValidationError,
} from '../index'

const root = join(dirname(fileURLToPath(import.meta.url)), '../../contracts')
const ajv = new Ajv2020({ allErrors: true, strict: false })

function readJson(relative: string): unknown {
  return JSON.parse(readFileSync(join(root, relative), 'utf8'))
}

const workflowSchema = readJson('workflow.schema.json') as AnySchema
const catalogSchema = readJson('node-catalog.schema.json') as AnySchema
const validateWorkflowSchema = ajv.compile(workflowSchema)
const validateCatalogSchema = ajv.compile(catalogSchema)

describe('workflow + node catalog contract', () => {
  it('builtin catalog 通过 schema，parse 结果稳定', () => {
    const raw = readJson('fixtures/builtin.catalog.json')
    expect(validateCatalogSchema(raw)).toBe(true)
    const parsed = parseNodeCatalog(raw)
    expect(parsed.catalogVersion).toBe('1.0')
    expect(parsed.types.map(item => item.type)).toEqual(['start', 'end', 'task', 'condition'])
    expect(catalogFromNodeTypes(parsed.types)).toEqual(parsed)
  })

  it('合法请假流程通过 schema、parse、catalog 校验与 toRuntimePayload', () => {
    const raw = readJson('fixtures/leave-request.workflow.json')
    expect(validateWorkflowSchema(raw)).toBe(true)
    const workflow = parseWorkflow(raw)
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    validateWorkflowAgainstCatalog(workflow, catalog)
    const payload = toRuntimePayload(workflow, catalog)
    expect(payload.workflow.name).toBe('示例请假流程')
    expect(payload.catalog.catalogVersion).toBe('1.0')
    expect(validateWorkflowSchema(payload.workflow)).toBe(true)
  })

  it('悬空边在 parseWorkflow 失败', () => {
    const raw = readJson('fixtures/invalid-dangling-edge.json')
    expect(validateWorkflowSchema(raw)).toBe(true)
    expect(() => parseWorkflow(raw)).toThrow(WorkflowParseError)
  })

  it('未知 output 在 catalog 校验失败', () => {
    const workflow = parseWorkflow(readJson('fixtures/invalid-unknown-output.json'))
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(() => validateWorkflowAgainstCatalog(workflow, catalog)).toThrow(WorkflowValidationError)
    try {
      validateWorkflowAgainstCatalog(workflow, catalog)
    }
    catch (error) {
      expect(error).toBeInstanceOf(WorkflowValidationError)
      expect((error as WorkflowValidationError).issues.some(issue => issue.includes('未知输出'))).toBe(true)
    }
  })

  it('引用非上游节点失败', () => {
    const workflow = parseWorkflow({
      version: '1.0',
      nodes: [
        { id: 'start_1', type: 'start', position: { x: 0, y: 0 }, data: { label: '开始' } },
        { id: 'task_1', type: 'task', position: { x: 1, y: 0 }, data: { query: '{{ task_1.result }}' } },
        { id: 'end_1', type: 'end', position: { x: 2, y: 0 }, data: { query: '{{ task_1.result }}' } },
      ],
      edges: [
        { id: 'e1', source: 'start_1', target: 'end_1', sourceHandle: 'source', targetHandle: 'target' },
      ],
    })
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(() => validateWorkflowAgainstCatalog(workflow, catalog)).toThrow(/非上游节点/)
  })

  it('未知节点类型失败', () => {
    const workflow = parseWorkflow({
      version: '1.0',
      nodes: [
        { id: 'x', type: 'http', position: { x: 0, y: 0 }, data: {} },
      ],
      edges: [],
    })
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(() => validateWorkflowAgainstCatalog(workflow, catalog)).toThrow(/未知节点类型/)
  })

  it('引用不存在的节点失败', () => {
    const workflow = parseWorkflow({
      version: '1.0',
      nodes: [
        { id: 'start_1', type: 'start', position: { x: 0, y: 0 }, data: { label: '开始' } },
        { id: 'task_1', type: 'task', position: { x: 1, y: 0 }, data: { query: '{{ missing.result }}' } },
      ],
      edges: [
        { id: 'e1', source: 'start_1', target: 'task_1', sourceHandle: 'source', targetHandle: 'target' },
      ],
    })
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(() => validateWorkflowAgainstCatalog(workflow, catalog)).toThrow(/非上游节点/)
  })

  it('sourceHandle 不在 ports 上失败', () => {
    const workflow = parseWorkflow({
      version: '1.0',
      nodes: [
        { id: 'start_1', type: 'start', position: { x: 0, y: 0 }, data: { label: '开始' } },
        { id: 'end_1', type: 'end', position: { x: 1, y: 0 }, data: { label: '结束' } },
      ],
      edges: [
        { id: 'e1', source: 'start_1', target: 'end_1', sourceHandle: 'nope', targetHandle: 'target' },
      ],
    })
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(() => validateWorkflowAgainstCatalog(workflow, catalog)).toThrow(/sourceHandle/)
  })

  it('表达式不是 nodeId.outputName 时失败', () => {
    const workflow = parseWorkflow({
      version: '1.0',
      nodes: [
        { id: 'start_1', type: 'start', position: { x: 0, y: 0 }, data: { label: '开始' } },
        { id: 'task_1', type: 'task', position: { x: 1, y: 0 }, data: { query: '{{ result }}' } },
      ],
      edges: [
        { id: 'e1', source: 'start_1', target: 'task_1', sourceHandle: 'source', targetHandle: 'target' },
      ],
    })
    const catalog = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(() => validateWorkflowAgainstCatalog(workflow, catalog)).toThrow(/不是 nodeId.outputName/)
  })
})
