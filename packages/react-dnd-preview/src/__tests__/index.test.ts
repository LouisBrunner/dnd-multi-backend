import {describe, expect, test} from 'bun:test'
import {Context} from '../Context.js'
import * as Module from '../index.js'
import {Preview} from '../Preview.js'
import {usePreview} from '../usePreview.js'

describe('react-dnd-preview module', () => {
  test('exports correctly', () => {
    expect(Module.Preview).toBe(Preview)
    expect(Module.Context).toBe(Context)
    expect(Module.usePreview).toBe(usePreview)
  })
})
