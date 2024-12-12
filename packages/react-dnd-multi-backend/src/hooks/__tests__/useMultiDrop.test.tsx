import {TestPipeline} from '@mocks/pipeline'
import {renderHook} from '@testing-library/react'
import type {ReactNode} from 'react'

import {DndProvider} from '../..'
import {useMultiDrop} from '../useMultiDrop'

describe('useMultiDrop component', () => {
  const MultiAction = () => {
    return useMultiDrop({
      accept: 'card',
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }
      },
    })
  }

  test('fails without a context', () => {
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})
    expect(() => renderHook(MultiAction)).toThrow()
    spy.mockRestore()
  })

  test('it works', () => {
    const wrapper = ({children}: {children?: ReactNode}) => {
      return <DndProvider options={TestPipeline}>{children}</DndProvider>
    }
    const {result} = renderHook(MultiAction, {wrapper})

    const [props, backends] = result.current
    expect(props).toHaveLength(2)
    expect(props[0]).toHaveProperty('isOver', false)
    expect(props[0]).toHaveProperty('canDrop', false)
    expect(backends).toHaveProperty('back1')
    expect(backends).toHaveProperty('back2')
    expect(backends).not.toHaveProperty('back3')
    expect(backends.back1).toHaveLength(2)
    expect(backends.back1[0]).toHaveProperty('isOver', false)
    expect(backends.back1[0]).toHaveProperty('canDrop', false)
    expect(backends.back2).toHaveLength(2)
  })
})
