import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {render, screen, act} from '@testing-library/react';

import { Preview, PreviewContext } from '../Preview';
import { PreviewListImpl } from '../../../../dnd-multi-backend/src/PreviewListImpl';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { DndContext } from 'react-dnd';
import { PreviewPortalContext } from '../DndProvider';

// jest.mock('react-dnd-preview');

describe('Preview component', () => {
  let list;
  let previewEnabled;

  const Simple = () => {
    return <div>abc</div>;
  };

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0];
  };

  const PreviewFC = React.forwardRef((props, _ref) => {
    const backend = useContext(DndContext).dragDropManager.getBackend();
    backend.previews = list;
    backend.previewEnabled = previewEnabled;
    return <Preview {...props} />;
  });

  PreviewFC.displayName = 'PreviewFC';

  const Wrapped = wrapInTestContext(PreviewFC);

  beforeEach(() => {
    previewEnabled = jest.fn();
    list = new PreviewListImpl();
    jest.spyOn(list, 'register');
    jest.spyOn(list, 'unregister');
  });

  test('exports a context', () => {
    expect(Preview.Context).toBe(PreviewContext);
  });

  describe('using previews context', () => {
    const createComponent = ({generator} = {}) => {
      return render(<Wrapped generator={generator} />);
    };

    test('registers with the backend', () => {
      expect(list.register).not.toBeCalled();
      const {unmount} = createComponent({generator: jest.fn()});
      const matcher = expect.objectContaining({backendChanged: expect.any(Function)});
      expect(list.register).toBeCalledWith(matcher);
      expect(list.unregister).not.toBeCalled();
      unmount();
      expect(list.unregister).toBeCalledWith(matcher);
    });

    describe('it renders correctly', () => {
      const testRender = ({init}) => {
        previewEnabled.mockReturnValue(init);

        createComponent({generator: Simple});

        const expectNull = () => {
          expect(screen.queryByText('abc')).not.toBeInTheDocument();
        };

        const expectNotNull = () => {
          expect(screen.queryByText('abc')).toBeInTheDocument();
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
        expectNotNull();

        // No notification, no change
        act(() => {
          previewEnabled.mockReturnValue(false);
        });
        expectNotNull();

        act(() => {
          getLastRegister().backendChanged({previewEnabled});
        });
        expectNull();
      };

      test('not showing at first', () => {
        testRender({init: false});
      });

      test('showing at first', () => {
        testRender({init: true});
      });
    });
  });

  describe('using previews and portal context', () => {
    class Component extends React.Component {
      static propTypes = {
        generator: PropTypes.func,
      }

      constructor(props) {
        super(props);
        this.ref = React.createRef();
      }

      render() {
        return (
          <>
            <PreviewPortalContext.Provider value={this.ref.current}>
              <Wrapped generator={this.props.generator} />
            </PreviewPortalContext.Provider>
            <div ref={this.ref} />
          </>
        );
      }
    }

    test('portal is in detached div', () => {
      const {rerender} = render(<Component generator={Simple} />);
      rerender(<Component generator={Simple} />);
      act(() => {
        getLastRegister().backendChanged({
          previewEnabled: () => true,
        });
      });
      expect(screen.queryByText('abc')).toBeInTheDocument();
    });
  });
});
