import React, { useContext } from 'react';
import { mount } from 'enzyme';

import { Context } from '../Context';

jest.mock('../usePreview');

import { Preview } from '../Preview';

describe('Preview subcomponent', () => {
  const createComponent = (props) => {
    return mount(<Preview {...props} />);
  };

  const generator = ({itemType, item, style}) => { // eslint-disable-line react/prop-types
    return <div style={style}>{item.coucou}: {itemType}</div>; // eslint-disable-line react/prop-types
  };

  const setupTest = (props) => {
    test('is null when DnD is not in progress', () => {
      require('../usePreview').__setMockReturn(false);
      const component = createComponent(props);
      expect(component.find(Preview).html()).toBeNull();
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
      const component = createComponent(props);

      expect(component.html()).not.toBeNull();
      const div = component.find('div');
      expect(div).toExist();
      expect(div).toHaveText('dauphin: toto');
      expect(div).toHaveStyle('pointerEvents', 'none');
      expect(div).toHaveStyle('position', 'fixed');
      expect(div).toHaveStyle('top', 0);
      expect(div).toHaveStyle('left', 0);
      expect(div).toHaveStyle('transform', 'translate(1000px, 2000px)');
      expect(div).toHaveStyle('WebkitTransform', 'translate(1000px, 2000px)');
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
