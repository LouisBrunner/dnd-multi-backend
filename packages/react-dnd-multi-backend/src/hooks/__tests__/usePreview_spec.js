import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {render, screen, act} from '@testing-library/react';

import { usePreview } from '../usePreview';
import { PreviewListImpl } from '../../../../dnd-multi-backend/src/PreviewListImpl';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { DndContext } from 'react-dnd';

// jest.mock('react-dnd-preview');

describe('usePreview component', () => {
  let list;
  let previewEnabled;

  beforeEach(() => {
    previewEnabled = jest.fn();
    list = new PreviewListImpl();
    jest.spyOn(list, 'register');
    jest.spyOn(list, 'unregister');
  });

  const getLastRegister = () => {
    return list.register.mock.calls[list.register.mock.calls.length - 1][0];
  };

  const Preview = React.forwardRef(({children}, _ref) => {
    const backend = useContext(DndContext).dragDropManager.getBackend();
    backend.previews = list;
    backend.previewEnabled = previewEnabled;

    const { display } = usePreview();
    if (!display) {
      return null;
    }
    return children;
  });

  Preview.displayName = 'Preview';
  Preview.propTypes = {
    children: PropTypes.any,
  };

  const Wrapped = wrapInTestContext(Preview);

  const createComponent = (children) => {
    return render(<Wrapped>{children}</Wrapped>);
  };

  test('registers with the backend', () => {
    previewEnabled.mockReturnValue(false);
    expect(list.register).not.toBeCalled();
    const {unmount} = createComponent();
    const matcher = expect.objectContaining({backendChanged: expect.any(Function)});
    expect(list.register).toBeCalledWith(matcher);
    expect(list.unregister).not.toBeCalled();
    unmount();
    expect(list.unregister).toBeCalledWith(matcher);
  });

  describe('it renders correctly', () => {
    const testRender = ({init, hasContent}) => {
      const content = hasContent ? <div>abc</div> : null;
      previewEnabled.mockReturnValue(init);

      createComponent(content);

      const expectNull = () => {
        expect(screen.queryByText('abc')).not.toBeInTheDocument();
      };

      const expectNotNull = () => {
        if (hasContent) {
          expect(screen.queryByText('abc')).toBeInTheDocument();
        } else {
          expectNull();
        }
      };

      if (init) {
        expectNotNull();
      } else {
        expectNull();
      }

      act(() => {
        previewEnabled.mockReturnValue(true);
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
