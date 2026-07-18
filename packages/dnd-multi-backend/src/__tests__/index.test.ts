import {describe, expect, test} from 'bun:test'
import {createTransition} from '../createTransition.ts'
import {
  HTML5DragTransition as ModuleHTML5DragTransition,
  MouseTransition as ModuleMouseTransition,
  TouchTransition as ModuleTouchTransition,
  MultiBackend,
  createTransition as moduleCreateTransition,
} from '../index.ts'
import {MultiFactory} from '../MultiFactory.ts'
import {HTML5DragTransition, MouseTransition, TouchTransition} from '../transitions.ts'

describe('dnd-multi-backend module', () => {
  test('exports correctly', () => {
    expect(MultiBackend).toBe(MultiFactory)
    expect(ModuleHTML5DragTransition).toBe(HTML5DragTransition)
    expect(ModuleTouchTransition).toBe(TouchTransition)
    expect(ModuleMouseTransition).toBe(MouseTransition)
    expect(moduleCreateTransition).toBe(createTransition)
  })
})
