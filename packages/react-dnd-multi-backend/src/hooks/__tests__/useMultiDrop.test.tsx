import React from 'react'
import {render} from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import {TestPipeline} from '@mocks/pipeline'

import { useMultiDrop, useMultiDropState } from '../useMultiDrop'
import { DndProvider } from '../..'

describe('useMultiDrop component', () => {
  let _result: useMultiDropState<unknown>

  const MultiAction = () => {
    const result = useMultiDrop({
      accept: 'card',
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
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
