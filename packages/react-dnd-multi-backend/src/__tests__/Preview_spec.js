import React from 'react';
import { mount } from 'enzyme';

import DnDPreview from 'react-dnd-preview';
import Preview from '../Preview';
import { PreviewManager } from 'dnd-multi-backend';

jest.mock('dnd-multi-backend', () => {
  return {
    PreviewManager: {
      register: jest.fn(),
      unregister: jest.fn(),
    },
  };
});

describe('Preview component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

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

  test('registers with the backend', () => {
    expect(PreviewManager.register).not.toBeCalled();
    const component = createComponent();
    const instance = component.instance();
    expect(PreviewManager.register).toBeCalledWith(instance);
    expect(PreviewManager.unregister).not.toBeCalled();
    component.unmount();
    expect(PreviewManager.unregister).toBeCalledWith(instance);
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
    expect(component.find(DnDPreview)).not.toExist();

    component.instance().backendChanged({
      previewEnabled: () => { return true; },
    });
    component.update();
    expect(component.find(DnDPreview)).toExist();

    component.instance().backendChanged({
      previewEnabled: () => { return false; },
    });
    component.update();
    expect(component.find(DnDPreview)).not.toExist();
  });
});
