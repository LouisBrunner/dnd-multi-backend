import {describe, expect, test} from 'bun:test'
import {Context} from '../Context.ts'
import {Context as ModuleContext, Preview as ModulePreview, usePreview as moduleUsePreview} from '../index.ts'
import {Preview} from '../Preview.tsx'
import {usePreview} from '../usePreview.ts'

describe('react-dnd-preview module', () => {
  test('exports correctly', () => {
    expect(ModulePreview).toBe(Preview)
    expect(ModuleContext).toBe(Context)
    expect(moduleUsePreview).toBe(usePreview)
  })
})
