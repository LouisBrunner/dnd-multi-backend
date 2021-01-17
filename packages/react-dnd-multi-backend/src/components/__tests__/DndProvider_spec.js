import React, {useContext} from 'react';
import {render} from '@testing-library/react';

import { DndProvider, PreviewPortalContext } from '../DndProvider';

describe('DndProvider component', () => {
  const createComponent = (child) => {
    return render(
      <DndProvider options={{backends: [{id: 'abc', backend: () => {}}]}}>
        {child}
      </DndProvider>
    );
  };

  test('contexts have sensible defaults', () => {
    const Child = () => {
      const portal = useContext(PreviewPortalContext);
      expect(portal).toBeNull();
      return null;
    };
    render(<Child />);
  });

  test('can access both contexts', () => {
    const spy = jest.fn();
    const Child = () => {
      const portal = useContext(PreviewPortalContext);
      spy(portal);
      return null;
    };
    createComponent(<Child />);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, expect.any(HTMLElement));
  });
});
