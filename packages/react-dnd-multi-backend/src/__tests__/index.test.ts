import {describe, expect, test} from 'bun:test'
import {createTransition, HTML5DragTransition, MouseTransition, MultiBackend, TouchTransition} from 'dnd-multi-backend'
import {Context as PreviewContext} from 'react-dnd-preview'
import {DndProvider} from '../components/DndProvider.tsx'
import {Preview} from '../components/Preview.tsx'
import {useMultiDrag, useMultiDrop, usePreview} from '../hooks/index.ts'
import {
  DndProvider as ModuleDndProvider,
  HTML5DragTransition as ModuleHTML5DragTransition,
  MouseTransition as ModuleMouseTransition,
  MultiBackend as ModuleMultiBackend,
  Preview as ModulePreview,
  PreviewContext as ModulePreviewContext,
  TouchTransition as ModuleTouchTransition,
  createTransition as moduleCreateTransition,
  useMultiDrag as moduleUseMultiDrag,
  useMultiDrop as moduleUseMultiDrop,
  usePreview as moduleUsePreview,
} from '../index.ts'

describe('react-dnd-multi-backend module', () => {
  test('exports correctly', () => {
    expect(ModuleDndProvider).toBe(DndProvider)

    expect(ModulePreview).toBe(Preview)
    expect(ModulePreviewContext).toBe(PreviewContext)

    expect(moduleUsePreview).toBe(usePreview)
    expect(moduleUseMultiDrag).toBe(useMultiDrag)
    expect(moduleUseMultiDrop).toBe(useMultiDrop)

    expect(ModuleMultiBackend).toBe(MultiBackend)
    expect(ModuleHTML5DragTransition).toBe(HTML5DragTransition)
    expect(ModuleTouchTransition).toBe(TouchTransition)
    expect(ModuleMouseTransition).toBe(MouseTransition)
    expect(moduleCreateTransition).toBe(createTransition)
  })
})
