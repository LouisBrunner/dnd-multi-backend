import React from 'react';
import { mount } from 'enzyme';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext, DragSource } from 'react-dnd';

import Preview from '../index';

describe('Preview subcomponent', () => {
  const createComponent = ({generator = jest.fn(), source = null} = {}) => {
    @DragDropContext(TestBackend)
    class TestRoot extends React.Component {
      render() {
        return (
          <div>
            {source}
            <Preview generator={generator} />
          </div>
        );
      }
    }

    return mount(<TestRoot />);
  };

  test('is a DragLayer-decorated Preview', () => {
    const component = createComponent().find(Preview);
    expect(component.name()).toBe('DragLayer(Preview)');
    expect(component.instance()).toBeInstanceOf(Preview);
  });

  test('is null when DnD is not in progress', () => {
    const component = createComponent().find(Preview);
    expect(component.html()).toBeNull();
  });

  test('is valid when DnD is in progress', () => {
    const generator = (type, item, style) => {
      return <div style={style}>{item.coucou}: {type}</div>;
    };
    const Source =
      @DragSource('toto', {
        beginDrag: () => { return {coucou: 'dauphin'}; },
        canDrag: () => { return true; },
      }, (connect) => {
        return {connectDragSource: connect.dragSource()};
      })
      class DS extends React.Component {
        render() { return this.props.connectDragSource(<div />); }
      }
    ;

    const root = createComponent({source: <Source />, generator});

    const backend = root.instance().getManager().getBackend();
    backend.simulateBeginDrag([root.find(Source).instance().getHandlerId()], {
      clientOffset: {x: 1, y: 2},
      getSourceClientOffset: () => {
        return {x: 1000, y: 2000};
      },
    });
    root.update();

    const component = root.find(Preview);
    expect(component.html()).not.toBeNull();
    const div = component.find('div');
    expect(div).toExist();
    expect(div).toHaveText('dauphin: toto');
    expect(div).toHaveStyle('pointerEvents', 'none');
    expect(div).toHaveStyle('position', 'fixed');
    expect(div).toHaveStyle('top', 0);
    expect(div).toHaveStyle('left', 0);
    expect(div).toHaveStyle('transform', 'translate(1000px, 2000px)');
    expect(div).toHaveStyle('WebkitTransform', 'translate(1000px, 2000px)');
  });
});
