import React, { useState } from 'react'
import {render, screen, act} from '@testing-library/react'
import { Preview, PreviewContext } from '../Preview'
import { MockPreviewList, MockedPreviewList, MockedMultiBackend, MockMultiBackend } from '@mocks/mocks'
import { DndContext, DndContextType } from 'react-dnd'
import { PreviewPortalContext } from '../DndProvider'
import {PreviewGenerator} from 'react-dnd-preview'

type TestProps = {
  generator: PreviewGenerator
};

describe('Preview component', () => {
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

  const Simple = () => {
    return <div>abc</div>
  }

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0]
  }

  test('exports a context', () => {
    expect(Preview.Context).toBe(PreviewContext)
  })

  describe('using previews context', () => {
    const createComponent = ({generator}: TestProps) => {
      return render(
        <DndContext.Provider value={context}>
          <Preview generator={generator} />
        </DndContext.Provider>
      )
    }

    test('registers with the backend', () => {
      expect(list.register).not.toBeCalled()
      const {unmount} = createComponent({generator: jest.fn()})
      expect(list.register).toBeCalled()
      expect(list.unregister).not.toBeCalled()
      unmount()
      expect(list.unregister).toBeCalled()
    })

    describe('it renders correctly', () => {
      const testRender = ({init}: {init: boolean}) => {
        backend.previewEnabled.mockReturnValue(init)

        createComponent({generator: Simple})

        const expectNull = () => {
          expect(screen.queryByText('abc')).not.toBeInTheDocument()
        }

        const expectNotNull = () => {
          expect(screen.queryByText('abc')).toBeInTheDocument()
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

  describe('using previews and portal context', () => {
    const Component = ({generator}: TestProps): JSX.Element => {
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

    test('portal is in detached div', () => {
      render(<Component generator={Simple} />)
      act(() => {
        backend.previewEnabled.mockReturnValue(true)
        getLastRegister().backendChanged(backend)
      })
      expect(screen.queryByText('abc')).toBeInTheDocument()
    })
  })
})
