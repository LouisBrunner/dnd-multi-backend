import React, { useContext } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { Preview, PreviewContext } from '../Preview';
import { PreviewList } from 'dnd-multi-backend';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { DndContext } from 'react-dnd';
import { PreviewPortalContext } from '../DndProvider';

describe('Preview component', () => {
  let list;

  beforeEach(() => {
    list = new PreviewList();
    jest.spyOn(list, 'register');
    jest.spyOn(list, 'unregister');
  });

  test('exports a context', () => {
    expect(Preview.Context).toBe(PreviewContext);
  });

  const setupTest = (create) => {
    const getLastRegister = () => {
      return list.register.mock.calls[list.register.mock.calls.length - 1][0];
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
      const component = create({
        generator: () => { // eslint-disable-line react/display-name
          return <div>abc</div>;
        },
      });
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

  const Wrapped = wrapInTestContext((props) => {
    const backend = useContext(DndContext).dragDropManager.getBackend();
    backend.previews = list;

    return <Preview {...props} />;
  });

  describe('using previews context', () => {
    const createComponent = ({generator = jest.fn()} = {}) => {
      return mount(<Wrapped generator={generator} />);
    };

    setupTest(createComponent, () => list);
  });

  describe('using previews and portal context', () => {
    const createComponent = ({generator = jest.fn()} = {}) => {
      const Component = class Root extends React.Component {
        constructor(props) {
          super(props);
          this.ref = React.createRef();
        }

        render() {
          return (
            <>
              <PreviewPortalContext.Provider value={this.ref.current}>
                <Wrapped generator={generator} />
              </PreviewPortalContext.Provider>
              <div ref={this.ref} />
            </>
          );
        }
      };
      const component = mount(<Component />);
      component.instance().forceUpdate();
      return component;
    };

    const getLastRegister = setupTest(createComponent, () => list);

    test('portal is in detached div', () => {
      const component = createComponent({
        generator: () => { // eslint-disable-line react/display-name
          return <span>123</span>;
        },
      });
      act(() => {
        getLastRegister().backendChanged({
          previewEnabled: () => true,
        });
      });
      component.update();
      expect(component.find(Preview).find('Portal').html()).not.toBeNull();
    });
  });
});
