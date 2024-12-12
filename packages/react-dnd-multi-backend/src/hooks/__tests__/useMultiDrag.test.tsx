import {TestPipeline} from '@mocks/pipeline'
import {renderHook} from '@testing-library/react'
import type {ReactNode} from 'react'
import {DndProvider} from '../..'
import {useMultiDrag} from '../useMultiDrag'

describe('useMultiDrag component', () => {
  const MultiAction = () => {
    return useMultiDrag({
      type: 'card',
      item: {},
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        }
      },
    })
  }

  test('fails without a context', () => {
    let err: Error | undefined
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})
    try {
      renderHook(MultiAction)
    } catch (e) {
      err = e as Error
    } finally {
      spy.mockRestore()
      expect(err).toEqual(expect.any(Error))
    }
  })

  test('it works', () => {
    const wrapper = ({children}: {children?: ReactNode}) => {
      return <DndProvider options={TestPipeline}>{children}</DndProvider>
    }
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
