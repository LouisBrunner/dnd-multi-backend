import React from 'react';
import { mount } from 'enzyme';

import { useMultiDrag } from '../useMultiDrag';
import { DndProvider } from '../../';

describe('useMultiDrag component', () => {
  const _defaultPipeline = {
    backends: [
      {id: 'first', backend: () => ({setup: () => {}})},
      {id: 'second', backend: () => ({})},
    ],
  };
  let _result;

  const MultiAction = () => {
    const result = useMultiDrag({
      item: {type: 'card'},
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    });

    _result = result;

    return null;
  };

  const createComponent = (options = _defaultPipeline) => {
    return mount(<DndProvider options={options}><MultiAction /></DndProvider>);
  };

  test('it works', () => {
    createComponent();

    const [props, backends] = _result;
    expect(props).toHaveLength(3);
    expect(props[0]).toHaveProperty('isDragging', false);
    expect(backends).toHaveProperty('first');
    expect(backends).toHaveProperty('second');
    expect(backends).not.toHaveProperty('third');
    expect(backends.first).toHaveLength(3);
    expect(backends.first[0]).toHaveProperty('isDragging', false);
    expect(backends.second).toHaveLength(3);
  });
});
