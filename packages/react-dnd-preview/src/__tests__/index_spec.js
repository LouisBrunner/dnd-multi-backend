import React from 'react';
import { mount } from 'enzyme';
import { wrapInTestContext } from 'react-dnd-test-utils';
// import { useDrag } from 'react-dnd';

import Preview from '../index';

describe('Preview subcomponent', () => {
  const createComponent = () => {
    const Wrapped = wrapInTestContext(Preview);
    return mount(<Wrapped generator={() => { return null; }} />);
  };

  test('is a DragLayer-decorated Preview', () => {
    const component = createComponent();
    expect(component.find(Preview).name()).toBe('Preview');
  });

  test('is null when DnD is not in progress', () => {
    const component = createComponent();
    expect(component.find(Preview).html()).toBeNull();
  });

  // FIXME: Enzyme can't mock it, TestUtils can't mock it, this is absolutely broken
  // test('is valid when DnD is in progress', () => {
  //   const generator = (type, item, style) => {
  //     return <div style={style}>{item.coucou}: {type}</div>;
  //   };
  //
  //   const Source = () => {
  //     const [_, drag] = useDrag({
  //       item: {type: 'toto', coucou: 'dauphin'},
  //     });
  //     return <div ref={drag} />;
  //   };
  //
  //   const root = createComponentDnD({generator, source: <Source />});
  //
  //   const backend = root.getManager().getBackend();
  //   const source =  root.find(Preview);
  //   backend.simulateBeginDrag([source.getHandlerId()], {
  //     clientOffset: {x: 1, y: 2},
  //     getSourceClientOffset: () => {
  //       return {x: 1000, y: 2000};
  //     },
  //   });
  //   root.update();
  //
  //   const component = root.find(Preview);
  //   expect(component.html()).not.toBeNull();
  //   const div = component.find('div');
  //   expect(div).toExist();
  //   expect(div).toHaveText('dauphin: toto');
  //   expect(div).toHaveStyle('pointerEvents', 'none');
  //   expect(div).toHaveStyle('position', 'fixed');
  //   expect(div).toHaveStyle('top', 0);
  //   expect(div).toHaveStyle('left', 0);
  //   expect(div).toHaveStyle('transform', 'translate(1000px, 2000px)');
  //   expect(div).toHaveStyle('WebkitTransform', 'translate(1000px, 2000px)');
  // });
});
