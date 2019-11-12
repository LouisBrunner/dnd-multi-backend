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

  const getLastRegister = () => {
    return PreviewManager.register.mock.calls[PreviewManager.register.mock.calls.length - 1][0];
  };

  const createComponent = ({generator = jest.fn()} = {}) => {
    const Wrapped = wrapInTestContext(Preview);
    return mount(<Wrapped generator={generator} />);
  };

  test('registers with the backend', () => {
    expect(PreviewManager.register).not.toBeCalled();
    const component = createComponent();
    const matcher = expect.objectContaining({backendChanged: expect.any(Function)});
    expect(PreviewManager.register).toBeCalledWith(matcher);
    expect(PreviewManager.unregister).not.toBeCalled();
    component.unmount();
    expect(PreviewManager.unregister).toBeCalledWith(matcher);
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

    getLastRegister().backendChanged({
      previewEnabled: () => { return true; },
    });
    component.update();
    expect(component.find(Preview).html()).not.toBeNull();

    getLastRegister().backendChanged({
      previewEnabled: () => { return false; },
    });
    component.update();
    expect(component.find(Preview).html()).toBeNull();
  });
});
