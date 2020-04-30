import React, { useContext } from 'react';
import { mount } from 'enzyme';

import { PreviewManager, PreviewList } from 'dnd-multi-backend';
import { DndProvider, PreviewsContext, PreviewPortalContext } from '../DndProvider';

describe('DndProvider component', () => {
  const createComponent = (child) => {
    return mount(
      <DndProvider options={{backends: [{backend: () => {}}]}}>
        {child}
      </DndProvider>
    );
  };

  test('contexts have sensible defaults', () => {
    const Child = () => {
      const previews = useContext(PreviewsContext);
      expect(previews).toBe(PreviewManager);
      expect(previews).toBeInstanceOf(PreviewList);

      const portal = useContext(PreviewPortalContext);
      expect(portal).toBeNull();

      return null;
    };
    mount(<Child />);
  });

  test('can access both contexts', () => {
    let first = true;

    const Child = () => {
      const previews = useContext(PreviewsContext);
      expect(previews).toBeInstanceOf(PreviewList);

      const portal = useContext(PreviewPortalContext);
      if (first) {
        expect(portal).toBeUndefined();
      } else {
        expect(portal).toBeInstanceOf(HTMLElement);
      }
      first = true;

      return null;
    };
    const component = createComponent(<Child />);
    component.update();
  });
});
