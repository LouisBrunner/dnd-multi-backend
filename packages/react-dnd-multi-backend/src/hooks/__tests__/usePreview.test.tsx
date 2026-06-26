import {describe, expect, test} from 'bun:test'
import {createMock, type Mocked} from '@mocks/mocks.js'
import {act, renderHook} from '@testing-library/react'
import type {DragDropManager} from 'dnd-core'
import type {MultiBackendSwitcher, PreviewList} from 'dnd-multi-backend'
import type {ReactNode} from 'react'
import {DndContext, type DndContextType} from 'react-dnd'
import {usePreview} from '../usePreview.js'

describe('usePreview component', () => {
  const setup = () => {
    const list = createMock<PreviewList>()
    const backend = createMock<MultiBackendSwitcher>()
    backend.previewsList.mockReturnValue(list)
    const manager = createMock<DragDropManager>()
    manager.getBackend.mockReturnValue(backend)
    const context: DndContextType = {
      dragDropManager: manager,
    }
    return {backend, context, list}
  }

  const getLastRegister = (list: Mocked<PreviewList>) => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0]
  }

  const createComponent = (context: DndContextType) => {
    const wrapper = ({children}: {children?: ReactNode}) => {
      return <DndContext.Provider value={context}>{children}</DndContext.Provider>
    }
    return renderHook(
      () => {
        return usePreview()
      },
      {wrapper},
    )
  }

  test('registers with the backend', () => {
    const {backend, context, list} = setup()

    backend.previewEnabled.mockReturnValue(false)
    expect(list.register).not.toHaveBeenCalled()
    const {unmount} = createComponent(context)
    expect(list.register).toHaveBeenCalled()
    expect(list.unregister).not.toHaveBeenCalled()
    unmount()
    expect(list.unregister).toHaveBeenCalled()
  })

  describe('it renders correctly', () => {
    const testRender = async ({init}: {init: boolean}) => {
      const {backend, context, list} = setup()

      backend.previewEnabled.mockReturnValue(init)

      const {result} = createComponent(context)

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

      await act<void>(() => {
        backend.previewEnabled.mockReturnValue(true)
        getLastRegister(list).backendChanged(backend)
      })
      expectNotNull()

      // No notification, no change
      await act<void>(() => {
        backend.previewEnabled.mockReturnValue(false)
      })
      expectNotNull()

      await act<void>(() => {
        getLastRegister(list).backendChanged(backend)
      })
      expectNull()
    }

    test('not showing at first', async () => {
      await testRender({init: false})
    })

    test('showing at first', async () => {
      await testRender({init: true})
    })
  })
})
