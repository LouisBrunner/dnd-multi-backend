import React from 'react';
import { mount } from 'enzyme';

import Preview from '../index';

describe('Preview component', () => {
  const createComponent = ({isDragging = false, currentOffset = null, generator = jest.fn(), item = {}, itemType = ''} = {}) => {
    const context = {
      dragDropManager: {
        getMonitor: () => {
          return {
            getSourceClientOffset: () => { return currentOffset; },
            isDragging: () => { return isDragging; },
            getItemType: () => { return itemType; },
            getItem: () => { return item; },
            subscribeToOffsetChange: () => {},
            subscribeToStateChange: () => {},
          };
        },
      },
    };
    return mount(<Preview generator={generator} />, {context});
  };

  test('is a DragLayer-decorated Preview', () => {
    const component = createComponent();
    expect(component.name()).toBe('DragLayer(Preview)');
    expect(component.instance()).toBeInstanceOf(Preview);
  });

  test('is null when DnD is not in progress', () => {
    const component = createComponent();
    expect(component.html()).toBeNull();
  });

  test('is valid when DnD is in progress', () => {
    const generator = (type, item, style) => {
      return <div style={style}>{item.coucou}: {type}</div>;
    };
    const component = createComponent({
      item: {coucou: 'dauphin'},
      itemType: 'toto',
      isDragging: true, currentOffset: {x: 1000, y: 2000},
      generator,
    });
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
});
