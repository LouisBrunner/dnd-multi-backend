import React, {useContext} from 'react'
import {render, screen} from '@testing-library/react'

import {Context, PreviewState} from '../Context'
import {Preview, PreviewProps} from '../Preview'
import {usePreviewState} from '../usePreview'

jest.mock('../usePreview')

type GeneratorProps = Omit<PreviewState, 'item'> & {
  item: {
    coucou: string,
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockedUsePreview = require('../usePreview') as {
  __setMockReturn: (state: usePreviewState) => void,
}

describe('Preview subcomponent', () => {
  const createComponent = (props: PreviewProps) => {
    return render(<Preview {...props} />)
  }

  const generator = ({itemType, item, style}: GeneratorProps) => {
    return <div style={style}>{item.coucou}: {itemType}</div>
  }

  const setupTest = (props: PreviewProps): void => {
    test('is null when DnD is not in progress', () => {
      mockedUsePreview.__setMockReturn({display: false})
      createComponent(props)
      expect(screen.queryByText('dauphin: toto')).not.toBeInTheDocument()
    })

    test('is valid when DnD is in progress', () => {
      mockedUsePreview.__setMockReturn({
        display: true,
        style: {
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          transform: 'translate(1000px, 2000px)',
          WebkitTransform: 'translate(1000px, 2000px)',
        },
        item: {coucou: 'dauphin'},
        itemType: 'toto',
        monitor: undefined,
        ref: undefined,
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
      return generator(useContext(Context))
    }

    setupTest({
      children: <Child />,
    })
  })

  describe('using child context', () => {
    setupTest({
      children: (
        <Context.Consumer>
          {generator}
        </Context.Consumer>
      ),
    })
  })
})
