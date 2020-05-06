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
  let previewEnabled;

  beforeEach(() => {
    previewEnabled = jest.fn();
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
    backend.previewEnabled = previewEnabled;

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
    previewEnabled.mockReturnValue(false);
    expect(list.register).not.toBeCalled();
    const component = createComponent();
    const matcher = expect.objectContaining({backendChanged: expect.any(Function)});
    expect(list.register).toBeCalledWith(matcher);
    expect(list.unregister).not.toBeCalled();
    component.unmount();
    expect(list.unregister).toBeCalledWith(matcher);
  });

  describe('it renders correctly', () => {
    const testRender = ({init, hasContent}) => {
      const content = hasContent ? <div>abc</div> : null;
      previewEnabled.mockReturnValue(init);

      const component = createComponent(content);

      const expectNull = () => {
        expect(component.find(Preview).html()).toBeNull();
      };

      const expectNotNull = () => {
        if (hasContent) {
          expect(component.find(Preview).html()).not.toBeNull();
        } else {
          expectNull();
        }
      };

      if (init) {
        expectNotNull();
      } else {
        expectNull();
      }

      previewEnabled.mockReturnValue(true);
      act(() => {
        getLastRegister().backendChanged({previewEnabled});
      });
      component.update();
      expectNotNull();

      // No notification, no change
      previewEnabled.mockReturnValue(false);
      component.update();
      expectNotNull();

      act(() => {
        getLastRegister().backendChanged({previewEnabled});
      });
      component.update();
      expectNull();
    };

    test('empty & not showing at first', () => {
      testRender({init: false, hasContent: false});
    });

    test('empty & showing at first', () => {
      testRender({init: true, hasContent: false});
    });

    test('not empty & not showing at first', () => {
      testRender({init: false, hasContent: true});
    });

    test('not empty & showing at first', () => {
      testRender({init: true, hasContent: true});
    });
  });
});
