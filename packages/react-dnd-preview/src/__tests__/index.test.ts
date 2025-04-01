import * as Module from '../index'

import {Context} from '../Context'
import {Preview} from '../Preview'
import {usePreview} from '../usePreview'

describe('react-dnd-preview module', () => {
  test('exports correctly', () => {
    expect(Module.Preview).toBe(Preview)
    expect(Module.Context).toBe(Context)
    expect(Module.usePreview).toBe(usePreview)
  })
})
