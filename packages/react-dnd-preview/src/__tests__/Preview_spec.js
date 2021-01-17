import React, {useContext} from 'react';
import {render, screen} from '@testing-library/react';

import { Context } from '../Context';

jest.mock('../usePreview');

import { Preview } from '../Preview';

describe('Preview subcomponent', () => {
  const createComponent = (props) => {
    return render(<Preview {...props} />);
  };

  const generator = ({itemType, item, style}) => {
    return <div style={style}>{item.coucou}: {itemType}</div>;
  };

  const setupTest = (props) => {
    test('is null when DnD is not in progress', () => {
      require('../usePreview').__setMockReturn(false);
      createComponent(props);
      expect(screen.queryByText('dauphin: toto')).not.toBeInTheDocument();
    });

    test('is valid when DnD is in progress', () => {
      require('../usePreview').__setMockReturn(true, {
        style: {
          pointerEvents: 'none',
          position: 'fixed', top: 0, left: 0,
          transform: 'translate(1000px, 2000px)', WebkitTransform: 'translate(1000px, 2000px)',
        },
        item: {coucou: 'dauphin'},
        itemType: 'toto',
      });
      createComponent(props);
      const node = screen.queryByText('dauphin: toto');
      expect(node).toBeInTheDocument();
      // FIXME: toHaveStyle ignores pointer-events and WebkitTransform
      // expect(node).toHaveStyle({
      //   pointerEvents: 'none',
      //   position: 'fixed',
      //   top: 0,
      //   left: 0,
      //   transform: 'translate(1000px, 2000px)',
      //   WebkitTransform: 'translate(1000px, 2000px)',
      // });
      // eslint-disable-next-line jest-dom/prefer-to-have-style
      expect(node).toHaveAttribute('style', [
        'pointer-events: none',
        'position: fixed',
        'top: 0px',
        'left: 0px',
        'transform: translate(1000px, 2000px);',
      ].join('; '));
    });
  };

  describe('using generator prop', () => {
    setupTest({generator});
  });

  describe('using generator child', () => {
    setupTest({children: generator});
  });

  describe('using component child', () => {
    const Child = () => {
      return generator(useContext(Context));
    };

    setupTest({
      children: <Child />,
    });
  });

  describe('using child context', () => {
    setupTest({
      children: (
        <Context.Consumer>
          {generator}
        </Context.Consumer>
      ),
    });
  });
});
