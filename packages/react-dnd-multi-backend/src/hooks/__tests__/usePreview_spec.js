import React, { useContext } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { usePreview } from '../usePreview';
import { PreviewList } from 'dnd-multi-backend';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { DndContext } from 'react-dnd';

jest.mock('react-dnd-preview', () => {
  return {
    usePreview: () => ({display: true}),
  };
});

describe('usePreview component', () => {
  let list;

  beforeEach(() => {
    list = new PreviewList();
    jest.spyOn(list, 'register');
    jest.spyOn(list, 'unregister');
  });

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0];
  };

  const Preview = ({children}) => { // eslint-disable-line react/prop-types
    const backend = useContext(DndContext).dragDropManager.getBackend();
    backend.previews = list;

    const { display } = usePreview();
    if (!display) {
      return null;
    }
    return children;
  };

  const Wrapped = wrapInTestContext(Preview);

  const createComponent = (children) => {
    return mount(<Wrapped>{children}</Wrapped>);
  };

  test('registers with the backend', () => {
    expect(list.register).not.toBeCalled();
    const component = createComponent();
    const matcher = expect.objectContaining({backendChanged: expect.any(Function)});
    expect(list.register).toBeCalledWith(matcher);
    expect(list.unregister).not.toBeCalled();
    component.unmount();
    expect(list.unregister).toBeCalledWith(matcher);
  });

  test('is empty (no preview)', () => {
    const component = createComponent();
    expect(component.find(Preview).html()).toBeNull();
  });

  test('is not empty (preview)', () => {
    const component = createComponent(<div>abc</div>);
    expect(component.find(Preview).html()).toBeNull();

    act(() => {
      getLastRegister().backendChanged({
        previewEnabled: () => true,
      });
    });
    component.update();
    expect(component.find(Preview).html()).not.toBeNull();

    act(() => {
      getLastRegister().backendChanged({
        previewEnabled: () => false,
      });
    });
    component.update();
    expect(component.find(Preview).html()).toBeNull();
  });
});
