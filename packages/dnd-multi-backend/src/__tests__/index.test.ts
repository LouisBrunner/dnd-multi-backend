import * as Module from '../index'

import {MultiFactory} from '../MultiFactory'
import {createTransition} from '../createTransition'
import {HTML5DragTransition, MouseTransition, TouchTransition} from '../transitions'

describe('dnd-multi-backend module', () => {
  test('exports correctly', () => {
    expect(Module.MultiBackend).toBe(MultiFactory)
    expect(Module.HTML5DragTransition).toBe(HTML5DragTransition)
    expect(Module.TouchTransition).toBe(TouchTransition)
    expect(Module.MouseTransition).toBe(MouseTransition)
    expect(Module.createTransition).toBe(createTransition)
  })
})
