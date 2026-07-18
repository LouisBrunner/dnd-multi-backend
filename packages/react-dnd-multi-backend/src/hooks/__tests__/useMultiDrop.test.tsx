/** biome-ignore-all lint/complexity/useLiteralKeys: bracket access required by noPropertyAccessFromIndexSignature */
import {describe, expect, jest, test} from 'bun:test'
import {TestPipeline} from '@mocks/pipeline.js'
import {renderHook} from '@testing-library/react'
import type {ReactNode} from 'react'
import {DndProvider} from '../../index.ts'
import {useMultiDrop} from '../useMultiDrop.ts'

describe('useMultiDrop component', () => {
  const MultiAction = () =>
    useMultiDrop({
      accept: 'card',
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
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
    expect(props).toHaveLength(2)
    expect(props[0]).toHaveProperty('isOver', false)
    expect(props[0]).toHaveProperty('canDrop', false)
    expect(backends).toHaveProperty('back1')
    expect(backends).toHaveProperty('back2')
    expect(backends).not.toHaveProperty('back3')
    expect(backends['back1']).toHaveLength(2)
    expect(backends['back1']![0]).toHaveProperty('isOver', false)
    expect(backends['back1']![0]).toHaveProperty('canDrop', false)
    expect(backends['back2']).toHaveLength(2)
  })
})
