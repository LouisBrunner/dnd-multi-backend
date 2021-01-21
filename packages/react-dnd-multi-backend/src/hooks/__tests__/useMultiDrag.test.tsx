import React from 'react'
import {render} from '@testing-library/react'
import {TestPipeline} from 'dnd-multi-backend/src/__fixtures__/pipeline'

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
