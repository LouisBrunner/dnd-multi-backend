import React, { ReactElement, useContext } from 'react'
import {render, screen, act} from '@testing-library/react'

import { usePreview } from '../usePreview'
import { MockPreviewList, MockedPreviewList, MockMultiBackend } from '@mocks/mocks'
import { wrapInTestContext } from 'react-dnd-test-utils'
import { DndContext } from 'react-dnd'
import {MultiBackendSwitcher} from 'dnd-multi-backend'

type TestProps = {
  children?: ReactElement,
}

describe('usePreview component', () => {
  let list: MockedPreviewList
  let previewEnabled: jest.Mock<boolean>

  beforeEach(() => {
    previewEnabled = jest.fn() as jest.Mock<boolean>
    list = MockPreviewList()
  })

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0]
  }

  const PreviewFC = React.forwardRef((props: TestProps, _ref) => {
    const backend = useContext(DndContext).dragDropManager.getBackend() as MultiBackendSwitcher
    backend.previewsList = () => {
      return list
    }
    backend.previewEnabled = previewEnabled
    const { display } = usePreview()
    if (!display) {
      return null
    }
    return props.children // eslint-disable-line react/prop-types
  })

  PreviewFC.displayName = 'PreviewFC'

  const Wrapped = wrapInTestContext(PreviewFC) as React.Component<TestProps>

  const createComponent = (children?: ReactElement) => {
    return render(<Wrapped>{children}</Wrapped>)
  }

  test('registers with the backend', () => {
    previewEnabled.mockReturnValue(false)
    expect(list.register).not.toBeCalled()
    const {unmount} = createComponent()
    expect(list.register).toBeCalled()
    expect(list.unregister).not.toBeCalled()
    unmount()
    expect(list.unregister).toBeCalled()
  })

  describe('it renders correctly', () => {
    const testRender = ({init, hasContent}) => {
      const content = hasContent ? <div>abc</div> : null
      const backend = {
        ...MockMultiBackend(),
        previewEnabled,
      }
      previewEnabled.mockReturnValue(init)

      createComponent(content)

      const expectNull = () => {
        expect(screen.queryByText('abc')).not.toBeInTheDocument()
      }

      const expectNotNull = () => {
        if (hasContent) {
          expect(screen.queryByText('abc')).toBeInTheDocument()
        } else {
          expectNull()
        }
      }

      if (init) {
        expectNotNull()
      } else {
        expectNull()
      }

      act(() => {
        previewEnabled.mockReturnValue(true)
        getLastRegister().backendChanged(backend)
      })
      expectNotNull()

      // No notification, no change
      act(() => {
        previewEnabled.mockReturnValue(false)
      })
      expectNotNull()

      act(() => {
        getLastRegister().backendChanged(backend)
      })
      expectNull()
    }

    test('empty & not showing at first', () => {
      testRender({init: false, hasContent: false})
    })

    test('empty & showing at first', () => {
      testRender({init: true, hasContent: false})
    })

    test('not empty & not showing at first', () => {
      testRender({init: false, hasContent: true})
    })

    test('not empty & showing at first', () => {
      testRender({init: true, hasContent: true})
    })
  })
})
