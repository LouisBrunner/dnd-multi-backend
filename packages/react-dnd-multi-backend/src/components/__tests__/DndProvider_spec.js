import React, { useContext } from 'react';
import { mount } from 'enzyme';

import { DndProvider, PreviewPortalContext } from '../DndProvider';

describe('DndProvider component', () => {
  const createComponent = (child) => {
    return mount(
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
    mount(<Child />);
  });

  test('can access both contexts', () => {
    const spy = jest.fn();
    const Child = () => {
      const portal = useContext(PreviewPortalContext);
      spy(portal);
      return null;
    };
    const component = createComponent(<Child />);
    component.setProps();
    component.update();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, expect.any(HTMLElement));
  });
});
