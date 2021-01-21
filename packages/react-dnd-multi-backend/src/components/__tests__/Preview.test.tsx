import React, { useContext, useState } from 'react'
import {render, screen, act} from '@testing-library/react'

import { Preview, PreviewContext } from '../Preview'
import { PreviewListImpl } from 'dnd-multi-backend/src/PreviewListImpl'
import { wrapInTestContext } from 'react-dnd-test-utils'
import { DndContext } from 'react-dnd'
import {MultiBackendSwitcher} from 'dnd-multi-backend'
import { PreviewPortalContext } from '../DndProvider'
import {PreviewGenerator} from 'react-dnd-preview'

type TestProps = {
  generator: PreviewGenerator
}

describe('Preview component', () => {
  let list: jest.Mocked<PreviewListImpl>
  let previewEnabled: jest.Mock<boolean>

  const Simple = () => {
    return <div>abc</div>
  }

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0]
  }

  const PreviewFC = React.forwardRef((props: TestProps, _ref) => {
    const backend = useContext(DndContext).dragDropManager.getBackend() as MultiBackendSwitcher
    backend.previewsList = () => {
      return list
    }
    backend.previewEnabled = previewEnabled
    return <Preview {...props} />
  })

  PreviewFC.displayName = 'PreviewFC'

  const Wrapped = wrapInTestContext(PreviewFC) as React.Component<TestProps>

  beforeEach(() => {
    previewEnabled = jest.fn() as jest.Mock<boolean>
    list = new PreviewListImpl()
    jest.spyOn(list, 'register')
    jest.spyOn(list, 'unregister')
  })

  test('exports a context', () => {
    expect(Preview.Context).toBe(PreviewContext)
  })

  describe('using previews context', () => {
    const createComponent = ({generator}: TestProps) => {
      return render(<Wrapped generator={generator} />)
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
      const testRender = ({init}) => {
        previewEnabled.mockReturnValue(init)

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

        previewEnabled.mockReturnValue(true)
        act(() => {
          getLastRegister().backendChanged({previewEnabled})
        })
        expectNotNull()

        // No notification, no change
        act(() => {
          previewEnabled.mockReturnValue(false)
        })
        expectNotNull()

        act(() => {
          getLastRegister().backendChanged({previewEnabled})
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
            <Wrapped generator={generator} />
          </PreviewPortalContext.Provider>
          <div ref={setRef} />
        </>
      )
    }

    test('portal is in detached div', () => {
      render(<Component generator={Simple} />)
      act(() => {
        getLastRegister().backendChanged({
          previewEnabled: () => {
            return true
          },
        })
      })
      expect(screen.queryByText('abc')).toBeInTheDocument()
    })
  })
})
