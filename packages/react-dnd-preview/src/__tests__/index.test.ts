import * as Module from '../index'

import { Preview } from '../Preview'
import { Context } from '../Context'
import { usePreview } from '../usePreview'

describe('react-dnd-preview module', () => {
  test('exports correctly', () => {
    expect(Module.Preview).toBe(Preview)
    expect(Module.Context).toBe(Context)
    expect(Module.usePreview).toBe(usePreview)
  })
})
