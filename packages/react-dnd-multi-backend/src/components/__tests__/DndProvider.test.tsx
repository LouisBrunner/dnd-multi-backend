import {TestPipeline} from '@mocks/pipeline'
import {render} from '@testing-library/react'
import {type ReactNode, useContext} from 'react'

import {DndProvider, PreviewPortalContext} from '../DndProvider'

describe('DndProvider component', () => {
  const createComponent = (child: ReactNode, element?: Element) => {
    return render(
      <DndProvider options={TestPipeline} portal={element}>
        {child}
      </DndProvider>,
    )
  }

  test('contexts have sensible defaults', () => {
    const Child = () => {
      const portal = useContext(PreviewPortalContext)
      expect(portal).toBeNull()
      return null
    }
    render(<Child />)
  })

  test('can access both contexts', () => {
    const spy = jest.fn()
    const Child = () => {
      const portal = useContext(PreviewPortalContext)
      spy(portal)
      return null
    }
    createComponent(<Child />)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenNthCalledWith(1, null)
    expect(spy).toHaveBeenNthCalledWith(2, expect.any(HTMLElement))
  })

  test('can pass an external reference', () => {
    document.body.innerHTML = `
      <div>
        <span id="portal" />
      </div
    `
    const portal = document.getElementById('portal')
    expect(portal).not.toBeNull()
    if (portal === null) {
      return
    }
    const spy = jest.fn()

    const Child = () => {
      spy(useContext(PreviewPortalContext))
      return null
    }
    createComponent(<Child />, portal)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenNthCalledWith(1, portal)
  })
})
