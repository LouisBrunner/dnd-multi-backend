import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { usePreview } from '../usePreview';
import { PreviewManager, PreviewList } from 'dnd-multi-backend';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { PreviewsContext } from '../DndProvider';

jest.mock('react-dnd-preview', () => {
  return {
    usePreview: () => ({display: true}),
  };
});

const setupTest = (createComponent, lazyList) => {
  let list;

  beforeEach(() => {
    list = lazyList();
  });

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0];
  };

  const Preview = ({children}) => { // eslint-disable-line react/prop-types
    const { display } = usePreview();
    if (!display) {
      return null;
    }
    return children;
  };

  const Wrapped = wrapInTestContext(Preview);

  const create = (children) => {
    return createComponent(<Wrapped>{children}</Wrapped>);
  };

  test('registers with the backend', () => {
    expect(list.register).not.toBeCalled();
    const component = create();
    const matcher = expect.objectContaining({backendChanged: expect.any(Function)});
    expect(list.register).toBeCalledWith(matcher);
    expect(list.unregister).not.toBeCalled();
    component.unmount();
    expect(list.unregister).toBeCalledWith(matcher);
  });

  test('is empty (no preview)', () => {
    const component = create();
    expect(component.find(Preview).html()).toBeNull();
  });

  test('is not empty (preview)', () => {
    const component = create(<div>abc</div>);
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

  return getLastRegister;
};

describe('usePreview component', () => {
  describe('using global context', () => {
    beforeEach(() => {
      jest.spyOn(PreviewManager, 'register');
      jest.spyOn(PreviewManager, 'unregister');
    });

    afterEach(() => {
      PreviewManager.register.mockRestore();
      PreviewManager.unregister.mockRestore();
    });

    const createComponent = (child) => {
      return mount(child);
    };

    setupTest(createComponent, () => PreviewManager);
  });

  describe('using previews context', () => {
    let list;

    beforeEach(() => {
      list = new PreviewList();
      jest.spyOn(list, 'register');
      jest.spyOn(list, 'unregister');
    });

    const createComponent = (child) => {
      return mount(
        <PreviewsContext.Provider value={list}>
          {child}
        </PreviewsContext.Provider>
      );
    };

    setupTest(createComponent, () => list);
  });
});
