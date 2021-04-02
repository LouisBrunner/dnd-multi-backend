import React, {useContext} from 'react'
import {render, screen} from '@testing-library/react'

import {Context, PreviewState} from '../Context'
import {Preview, PreviewProps} from '../Preview'
import {usePreviewState} from '../usePreview'
import {MockDragMonitor} from '@mocks/mocks'

jest.mock('../usePreview')

type DragContent = {
  type: string,
  coucou: string,
}

type GeneratorProps = PreviewState<DragContent>

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {__setMockReturn} = require('../usePreview') as {
  __setMockReturn: (state: usePreviewState<DragContent>) => void,
}

describe('Preview subcomponent', () => {
  const createComponent = (props: PreviewProps<DragContent>) => {
    return render(<Preview {...props} />)
  }

  const generator = ({itemType, item, style}: GeneratorProps) => {
    return <div style={style}>{item.coucou}: {itemType}</div>
  }

  const setupTest = (props: PreviewProps<DragContent>): void => {
    test('is null when DnD is not in progress', () => {
      __setMockReturn({display: false})
      createComponent(props)
      expect(screen.queryByText('dauphin: toto')).not.toBeInTheDocument()
    })

    test('is valid when DnD is in progress', () => {
      __setMockReturn({
        display: true,
        style: {
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          transform: 'translate(1000px, 2000px)',
          WebkitTransform: 'translate(1000px, 2000px)',
        },
        item: {type: 'toto', coucou: 'dauphin'},
        itemType: 'toto',
        monitor: MockDragMonitor(),
        ref: {current: null},
      })
      createComponent(props)
      const node = screen.queryByText('dauphin: toto')
      expect(node).toBeInTheDocument()
      // FIXME: toHaveStyle ignores pointer-events and WebkitTransform
      // expect(node).toHaveStyle({
      //   pointerEvents: 'none',
      //   position: 'fixed',
      //   top: 0,
      //   left: 0,
      //   transform: 'translate(1000px, 2000px)',
      //   WebkitTransform: 'translate(1000px, 2000px)',
      // })
      // eslint-disable-next-line jest-dom/prefer-to-have-style
      expect(node).toHaveAttribute('style', [
        'pointer-events: none',
        'position: fixed',
        'top: 0px',
        'left: 0px',
        'transform: translate(1000px, 2000px);',
      ].join('; '))
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
      // FIXME: gross
      return generator(props as GeneratorProps)
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
            return generator(props as GeneratorProps)
          }}
        </Context.Consumer>
      ),
    })
  })
})
