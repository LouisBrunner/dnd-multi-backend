import React from 'react';
import { mount } from 'enzyme';

import DnDPreview from 'react-dnd-preview';
import Preview from '../Preview';

describe('Preview component', () => {
  const createComponent = ({preview = false, generator = jest.fn()} = {}) => {
    const context = {
      dragDropManager: {
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
    expect(component.name()).toBe('Preview');
    expect(component.instance()).toBeInstanceOf(React.PureComponent);
  });

  test('is empty (no preview)', () => {
    const component = createComponent();
    expect(component.html()).toBeNull();
  });

  test('is not empty (preview)', () => {
    const component = createComponent({
      preview: true,
      generator: () => {},
    });
    expect(component.find(DnDPreview)).toExist();
  });
});
