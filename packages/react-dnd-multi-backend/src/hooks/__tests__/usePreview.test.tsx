import React, {ReactNode} from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { usePreview } from '../usePreview'
import { MockPreviewList, MockedPreviewList, MockMultiBackend, MockedMultiBackend } from '@mocks/mocks'
import { DndContext, DndContextType } from 'react-dnd'

describe('usePreview component', () => {
  let list: MockedPreviewList
  let backend: MockedMultiBackend
  let context: DndContextType

  beforeEach(() => {
    list = MockPreviewList()
    backend = MockMultiBackend()
    backend.previewsList.mockReturnValue(list)
    context = {
      dragDropManager: {
        getBackend: () => {
          return backend
        },
        getMonitor: jest.fn(),
        getRegistry: jest.fn(),
        getActions: jest.fn(),
        dispatch: jest.fn(),
      },
    }
  })

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0]
  }

  const createComponent = () => {
    const wrapper = ({children}: {children?: ReactNode}) => { return <DndContext.Provider value={context}>{children}</DndContext.Provider> }
    return renderHook(() => { return usePreview() }, {wrapper})
  }

  test('registers with the backend', () => {
    backend.previewEnabled.mockReturnValue(false)
    expect(list.register).not.toBeCalled()
    const {unmount} = createComponent()
    expect(list.register).toBeCalled()
    expect(list.unregister).not.toBeCalled()
    unmount()
    expect(list.unregister).toBeCalled()
  })

  describe('it renders correctly', () => {
    const testRender = ({init}: {init: boolean}) => {
      backend.previewEnabled.mockReturnValue(init)

      const {result} = createComponent()

      const expectNull = () => {
        expect(result.current.display).toBe(false)
      }

      const expectNotNull = () => {
        expect(result.current.display).toBe(true)
      }

      if (init) {
        expectNotNull()
      } else {
        expectNull()
      }

      act(() => {
        backend.previewEnabled.mockReturnValue(true)
        getLastRegister().backendChanged(backend)
      })
      expectNotNull()

      // No notification, no change
      act(() => {
        backend.previewEnabled.mockReturnValue(false)
      })
      expectNotNull()

      act(() => {
        getLastRegister().backendChanged(backend)
      })
      expectNull()
    }

    test('not showing at first', () => {
      testRender({init: false})
    })

    test('showing at first', () => {
      testRender({init: true})
    })
  })
})
