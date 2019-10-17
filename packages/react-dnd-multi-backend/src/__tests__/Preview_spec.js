import React from 'react';
import { mount } from 'enzyme';

import Preview from '../Preview';
import { PreviewManager } from 'dnd-multi-backend';
import { wrapInTestContext } from 'react-dnd-test-utils';

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

  const createComponent = ({generator = jest.fn()} = {}) => {
    const Wrapped = wrapInTestContext(Preview);
    return mount(<Wrapped generator={generator} />);
  };

  test('is a PureComponent', () => {
    const component = createComponent().find(Preview);
    expect(component.name()).toBe('Preview');
    expect(component.instance()).toBeInstanceOf(React.PureComponent);
  });

  test('registers with the backend', () => {
    expect(PreviewManager.register).not.toBeCalled();
    const component = createComponent();
    const instance = component.find(Preview).instance();
    expect(PreviewManager.register).toBeCalledWith(instance);
    expect(PreviewManager.unregister).not.toBeCalled();
    component.unmount();
    expect(PreviewManager.unregister).toBeCalledWith(instance);
  });

  test('is empty (no preview)', () => {
    const component = createComponent();
    expect(component.find(Preview).html()).toBeNull();
  });

  test('is not empty (preview)', () => {
    const component = createComponent({
      generator: () => { // eslint-disable-line react/display-name
        return <div>abc</div>;
      },
    });
    expect(component.find(Preview).html()).toBeNull();

    component.find(Preview).instance().backendChanged({
      previewEnabled: () => { return true; },
    });
    component.update();
    expect(component.find(Preview).html()).not.toBeNull();

    component.find(Preview).instance().backendChanged({
      previewEnabled: () => { return false; },
    });
    component.update();
    expect(component.find(Preview).html()).toBeNull();
  });
});
