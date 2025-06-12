import * as Module from '../index.js'

import {MultiFactory} from '../MultiFactory.js'
import {createTransition} from '../createTransition.js'
import {HTML5DragTransition, MouseTransition, TouchTransition} from '../transitions.js'

describe('dnd-multi-backend module', () => {
  test('exports correctly', () => {
    expect(Module.MultiBackend).toBe(MultiFactory)
    expect(Module.HTML5DragTransition).toBe(HTML5DragTransition)
    expect(Module.TouchTransition).toBe(TouchTransition)
    expect(Module.MouseTransition).toBe(MouseTransition)
    expect(Module.createTransition).toBe(createTransition)
  })
})
