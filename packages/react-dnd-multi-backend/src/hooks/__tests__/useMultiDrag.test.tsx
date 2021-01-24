import React, {ReactNode} from 'react'
import { renderHook } from '@testing-library/react-hooks'
import {TestPipeline} from '@mocks/pipeline'
import { useMultiDrag } from '../useMultiDrag'
import { DndProvider } from '../..'

describe('useMultiDrag component', () => {
  const MultiAction = () => {
    return useMultiDrag({
      item: {type: 'card'},
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        }
      },
    })
  }

  test('fails without a context', () => {
    const {result} = renderHook(MultiAction)
    expect(result.error).toEqual(expect.any(Error))
  })

  test('it works', () => {
    const wrapper = ({children}: {children?: ReactNode}) => { return <DndProvider options={TestPipeline}>{children}</DndProvider> }
    const {result} = renderHook(MultiAction, {wrapper})

    const [props, backends] = result.current
    expect(props).toHaveLength(3)
    expect(props[0]).toHaveProperty('isDragging', false)
    expect(backends).toHaveProperty('back1')
    expect(backends).toHaveProperty('back2')
    expect(backends).not.toHaveProperty('back3')
    expect(backends.back1).toHaveLength(3)
    expect(backends.back1[0]).toHaveProperty('isDragging', false)
    expect(backends.back2).toHaveLength(3)
  })
})
