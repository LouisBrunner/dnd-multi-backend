import {describe, expect, mock, test} from 'bun:test'
import {createMock} from '@mocks/mocks.js'
import {render, screen} from '@testing-library/react'
import {useContext} from 'react'
import type {DragLayerMonitor} from 'react-dnd'
import {Context, type PreviewState} from '../Context.js'
import {Preview, type PreviewProps} from '../Preview.js'
import type {usePreviewState} from '../usePreview.js'

type DragContent = {
  coucou: string
}

type GeneratorProps = PreviewState<DragContent>

describe('Preview subcomponent', () => {
  const createComponent = (props: PreviewProps<DragContent>) => {
    return render(<Preview {...props} />)
  }

  const generator = ({itemType, item, style}: GeneratorProps) => {
    return (
      <div style={style}>
        {item.coucou}: {itemType?.toString()}
      </div>
    )
  }

  const __setMockReturn = (state: usePreviewState) => {
    mock.module('../usePreview.js', () => ({
      usePreview: () => state,
    }))
  }

  const setupTest = (props: PreviewProps<DragContent>): void => {
    test('is null when DnD is not in progress', () => {
      __setMockReturn({display: false})
      createComponent(props)
      expect(screen.queryByText('dauphin: toto')).not.toBeInTheDocument()
    })

    test('is valid when DnD is in progress', () => {
      const monitor = createMock<DragLayerMonitor<{coucou: string}>>()
      monitor.getItem.mockReturnValue({coucou: 'dauphin'})
      __setMockReturn({
        display: true,
        item: {coucou: 'dauphin'},
        itemType: 'toto',
        monitor,
        ref: {current: null},
        style: {
          left: 0,
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          transform: 'translate(1000px, 2000px)',
          WebkitTransform: 'translate(1000px, 2000px)',
        },
      })
      createComponent(props)
      const node = screen.queryByText('dauphin: toto')
      expect(node).toBeInTheDocument()
      // FIXME: toHaveStyle ignores pointer-events and WebkitTransform
      // expect(node).toHaveStyle({
      //   left: 0,
      //   pointerEvents: 'none',
      //   position: 'fixed',
      //   top: 0,
      //   transform: 'translate(1000px, 2000px)',
      //   WebkitTransform: 'translate(1000px, 2000px)',
      // })
      expect(node).toHaveAttribute('style', ['left: 0px', 'pointer-events: none', 'position: fixed', 'top: 0px', 'transform: translate(1000px, 2000px);'].join('; '))
    })
  }

  describe('using generator prop', () => {
    setupTest({generator})
  })

  describe('using generator child', () => {
    setupTest({children: generator})
  })

  describe('using component child', () => {
    const Child = () => {
      const props = useContext(Context)
      if (props === undefined) {
        return null
      }
      return generator(props as PreviewState<DragContent>)
    }

    setupTest({
      children: <Child />,
    })
  })

  describe('using child context', () => {
    setupTest({
      children: (
        <Context.Consumer>
          {(props?: PreviewState) => {
            if (props === undefined) {
              return null
            }
            return generator(props as PreviewState<DragContent>)
          }}
        </Context.Consumer>
      ),
    })
  })
})
