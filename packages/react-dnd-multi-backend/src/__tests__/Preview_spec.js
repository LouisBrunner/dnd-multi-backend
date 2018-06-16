import React from 'react';
import { mount } from 'enzyme';

import Preview from '../Preview';

describe('Preview component', () => {
  const createComponent = ({preview = false, isDragging = false, currentOffset = null, generator = jest.fn(), item = {}, itemType = ''} = {}) => {
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
        getBackend: () => {
          return {
            previewEnabled: () => { return preview; },
          };
        },
      },
    };
    return mount(<Preview generator={generator} />, {context});
  };

  test('is a PureComponent', () => {
    const component = createComponent();
    expect(component.name()).toBe('DragLayer(Preview)');
    expect(component.instance()).toBeInstanceOf(Preview);
  });

  test('no preview and no DnD', () => {
    const component = createComponent();
    expect(component.html()).toBeNull();
  });

  test('no preview and DnD', () => {
    const component = createComponent({isDragging: true, currentOffset: {x: 1000, y: 2000}});
    expect(component.html()).toBeNull();
  });

  test('preview and no DnD', () => {
    const component = createComponent({preview: true});
    expect(component.html()).toBeNull();
  });

  test('preview and DnD', () => {
    const generator = (type, item, style) => {
      return <div style={style}>{item.coucou}: {type}</div>;
    };
    const component = createComponent({
      item: {coucou: 'dauphin'},
      itemType: 'toto',
      preview: true,
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
