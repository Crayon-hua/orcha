import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseNodeCatalog } from '@ihxy/workflow-core'
import { builtinNodeCatalog } from '../builtin'

const fixtureRoot = join(dirname(fileURLToPath(import.meta.url)), '../../../../core/contracts')

function readJson(relative: string): unknown {
  return JSON.parse(readFileSync(join(fixtureRoot, relative), 'utf8'))
}

describe('builtin node catalog', () => {
  it('defineNodeType 派生结果与 core fixture 一致', () => {
    const parsed = parseNodeCatalog(readJson('fixtures/builtin.catalog.json'))
    expect(builtinNodeCatalog).toEqual(parsed)
    expect(parsed.types.map(item => item.type)).toEqual(['start', 'end', 'task', 'condition'])
  })
})
