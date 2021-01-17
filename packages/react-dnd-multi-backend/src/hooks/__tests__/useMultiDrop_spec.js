import React from 'react';
import {render} from '@testing-library/react';

import { useMultiDrop } from '../useMultiDrop';
import { DndProvider } from '../../';

describe('useMultiDrop component', () => {
  const _defaultPipeline = {
    backends: [
      {id: 'first', backend: () => ({setup: () => {}, teardown: () => {}})},
      {id: 'second', backend: () => ({})},
    ],
  };
  let _result;

  const MultiAction = () => {
    const result = useMultiDrop({
      accept: 'card',
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    });

    _result = result;

    return null;
  };

  const createComponent = (options = _defaultPipeline) => {
    return render(<DndProvider options={options}><MultiAction /></DndProvider>);
  };

  test('it works', () => {
    createComponent();

    const [props, backends] = _result;
    expect(props).toHaveLength(2);
    expect(props[0]).toHaveProperty('isOver', false);
    expect(props[0]).toHaveProperty('canDrop', false);
    expect(backends).toHaveProperty('first');
    expect(backends).toHaveProperty('second');
    expect(backends).not.toHaveProperty('third');
    expect(backends.first).toHaveLength(2);
    expect(backends.first[0]).toHaveProperty('isOver', false);
    expect(backends.first[0]).toHaveProperty('canDrop', false);
    expect(backends.second).toHaveLength(2);
  });
});
