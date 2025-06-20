import * as Module from '../index.js'

import {HTML5DragTransition, MouseTransition, MultiBackend, TouchTransition, createTransition} from 'dnd-multi-backend'
import {DndProvider} from '../components/DndProvider.js'
import {Preview, PreviewContext} from '../components/Preview.js'
import {useMultiDrag, useMultiDrop, usePreview} from '../hooks/index.js'

describe('react-dnd-multi-backend module', () => {
  test('exports correctly', () => {
    expect(Module.DndProvider).toBe(DndProvider)

    expect(Module.Preview).toBe(Preview)
    expect(Module.PreviewContext).toBe(PreviewContext)

    expect(Module.usePreview).toBe(usePreview)
    expect(Module.useMultiDrag).toBe(useMultiDrag)
    expect(Module.useMultiDrop).toBe(useMultiDrop)

    expect(Module.MultiBackend).toBe(MultiBackend)
    expect(Module.HTML5DragTransition).toBe(HTML5DragTransition)
    expect(Module.TouchTransition).toBe(TouchTransition)
    expect(Module.MouseTransition).toBe(MouseTransition)
    expect(Module.createTransition).toBe(createTransition)
  })
})
