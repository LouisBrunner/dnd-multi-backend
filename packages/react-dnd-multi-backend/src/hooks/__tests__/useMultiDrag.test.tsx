import React from 'react'
import {render} from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import {TestPipeline} from '@mocks/pipeline'

import { useMultiDrag, useMultiDragState } from '../useMultiDrag'
import { DndProvider } from '../..'

describe('useMultiDrag component', () => {
  let _result: useMultiDragState<unknown>

  const MultiAction = () => {
    const result = useMultiDrag({
      item: {type: 'card'},
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        }
      },
    })

    _result = result

    return null
  }

  const createComponent = (options = TestPipeline) => {
    return render(<DndProvider options={options}><MultiAction /></DndProvider>)
  }

  test('fails without a context', () => {
    const {result} = renderHook(MultiAction)
    expect(result.error).toEqual(expect.any(Error))
  })

  test('it works', () => {
    createComponent()

    const [props, backends] = _result
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
