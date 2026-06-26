import {describe, expect, jest, test} from 'bun:test'
import {createMock, type Mocked} from '@mocks/mocks.js'
import {act, render, screen} from '@testing-library/react'
import type {DragDropManager} from 'dnd-core'
import type {MultiBackendSwitcher, PreviewList} from 'dnd-multi-backend'
import {type JSX, useState} from 'react'
import {DndContext, type DndContextType} from 'react-dnd'
import type {PreviewGenerator} from 'react-dnd-preview'
import {PreviewPortalContext} from '../DndProvider.js'
import {Preview, PreviewContext} from '../Preview.js'

type TestProps = {
  generator: PreviewGenerator
  context: DndContextType
}

describe('Preview component', () => {
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

  const Simple = () => {
    return <div>abc</div>
  }

  const getLastRegister = (list: Mocked<PreviewList>) => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0]
  }

  test('exports a context', () => {
    expect(Preview.Context).toBe(PreviewContext)
  })

  describe('using previews context', () => {
    const createComponent = ({generator, context}: TestProps) => {
      return render(
        <DndContext.Provider value={context}>
          <Preview generator={generator} />
        </DndContext.Provider>,
      )
    }

    test('registers with the backend', () => {
      const {context, list} = setup()

      expect(list.register).not.toHaveBeenCalled()
      const {unmount} = createComponent({context, generator: jest.fn()})
      expect(list.register).toHaveBeenCalled()
      expect(list.unregister).not.toHaveBeenCalled()
      unmount()
      expect(list.unregister).toHaveBeenCalled()
    })

    describe('it renders correctly', () => {
      const {backend, context, list} = setup()

      const testRender = async ({init}: {init: boolean}) => {
        backend.previewEnabled.mockReturnValue(init)

        createComponent({context, generator: Simple})

        const expectNull = () => {
          expect(screen.queryByText('abc')).not.toBeInTheDocument()
        }

        const expectNotNull = () => {
          expect(screen.getByText('abc')).toBeInTheDocument()
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

      test.serial('not showing at first', async () => {
        await testRender({init: false})
      })

      test.serial('showing at first', async () => {
        await testRender({init: true})
      })
    })
  })

  describe('using previews and portal context', () => {
    const Component = ({generator, context}: TestProps): JSX.Element => {
      const [ref, setRef] = useState<Element | null>(null)

      return (
        <>
          <PreviewPortalContext.Provider value={ref}>
            <DndContext.Provider value={context}>
              <Preview generator={generator} />
            </DndContext.Provider>
          </PreviewPortalContext.Provider>
          <div ref={setRef} />
        </>
      )
    }

    test('portal is in detached div', async () => {
      const {backend, context, list} = setup()

      render(<Component context={context} generator={Simple} />)
      await act<void>(() => {
        backend.previewEnabled.mockReturnValue(true)
        getLastRegister(list).backendChanged(backend)
      })
      expect(screen.getByText('abc')).toBeInTheDocument()
    })
  })
})
