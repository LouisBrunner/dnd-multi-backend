import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import TestBackend from 'react-dnd-test-backend-cjs';
import { DndProvider, DragSource } from 'react-dnd-cjs';

import Preview from '../index';

describe('Preview subcomponent', () => {
  // = () => { return null; }
  const createComponent = ({generator, source = null} = {}) => {
    console.log(1, generator); // eslint-disable-line
    const TestRoot = (props) => {
      console.log(this, props); // eslint-disable-line
      console.log(2, props.previewGenerator, generator); // eslint-disable-line
      return (
        <div>
          <DndProvider backend={TestBackend}>
            {source}
            <Preview generator={() => {
              console.log(this, props); // eslint-disable-line
              console.log(3, props.previewGenerator, generator); // eslint-disable-line
              return props.previewGenerator();
            }} />
          </DndProvider>
        </div>
      );
    };

    return mount(<TestRoot previewGenerator={generator} />);
  };

  test('is a DragLayer-decorated Preview', () => {
    const component = createComponent().find(Preview);
    expect(component.name()).toBe('DragLayer(Preview)');
    expect(component.instance()).toBeInstanceOf(Preview);
  });

  test('is null when DnD is not in progress', () => {
    const component = createComponent().find(Preview);
    expect(component.html()).toEqual('');
  });

  test('is valid when DnD is in progress', () => {
    const generator = (type, item, style) => {
      return <div style={style}>{item.coucou}: {type}</div>;
    };

    const Source = (
      @DragSource('toto', {
        beginDrag: () => { return {coucou: 'dauphin'}; },
        canDrag: () => { return true; },
      }, (connect) => {
        return {connectDragSource: connect.dragSource()};
      })
      class DS extends React.Component {
        static propTypes = {connectDragSource: PropTypes.func}
        render() { return this.props.connectDragSource(<div />); }
      }
    );

    const root = createComponent({generator, source: <Source />});

    const instance = root.find(Source).instance();
    const backend = instance.manager.getBackend();
    backend.simulateBeginDrag([instance.getHandlerId()], {
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
