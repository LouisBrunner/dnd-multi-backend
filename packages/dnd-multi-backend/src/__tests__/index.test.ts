import * as Module from '../index'

import { HTML5DragTransition, TouchTransition, MouseTransition } from '../transitions'
import {createTransition} from '../createTransition'
import {MultiFactory} from '../MultiFactory'

describe('dnd-multi-backend module', () => {
  test('exports correctly', () => {
    expect(Module.MultiBackend).toBe(MultiFactory)
    expect(Module.HTML5DragTransition).toBe(HTML5DragTransition)
    expect(Module.TouchTransition).toBe(TouchTransition)
    expect(Module.MouseTransition).toBe(MouseTransition)
    expect(Module.createTransition).toBe(createTransition)
  })
})
