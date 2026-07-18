/** biome-ignore-all lint/complexity/useLiteralKeys: bracket access required by noPropertyAccessFromIndexSignature */
import {describe, expect, jest, test} from 'bun:test'
import {TestPipeline} from '@mocks/pipeline.js'
import {renderHook} from '@testing-library/react'
import type {ReactNode} from 'react'
import {DndProvider} from '../../index.ts'
import {useMultiDrag} from '../useMultiDrag.ts'

describe('useMultiDrag component', () => {
  const MultiAction = () =>
    useMultiDrag({
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: {},
      type: 'card',
    })

  test('fails without a context', () => {
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => undefined)
    expect(() => renderHook(MultiAction)).toThrow()
    spy.mockRestore()
  })

  test('it works', () => {
    const wrapper = ({children}: {children?: ReactNode}) => <DndProvider options={TestPipeline}>{children}</DndProvider>
    const {result} = renderHook(MultiAction, {wrapper})

    const [props, backends] = result.current
    expect(props).toHaveLength(3)
    expect(props[0]).toHaveProperty('isDragging', false)
    expect(backends).toHaveProperty('back1')
    expect(backends).toHaveProperty('back2')
    expect(backends).not.toHaveProperty('back3')
    expect(backends['back1']).toHaveLength(3)
    expect(backends['back1']![0]).toHaveProperty('isDragging', false)
    expect(backends['back2']).toHaveLength(3)
  })
})
