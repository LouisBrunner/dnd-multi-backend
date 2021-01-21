import * as Module from '../index'

import { DndProvider } from '../components/DndProvider'
import { Preview, PreviewContext } from '../components/Preview'
import { useMultiDrag, useMultiDrop, usePreview } from '../hooks'
import { MultiBackend, HTML5DragTransition, TouchTransition, MouseTransition, createTransition } from 'dnd-multi-backend'


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
