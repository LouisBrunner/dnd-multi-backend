import React from 'react';
import { Preview, Context } from '../../src';
import { WithPropFunction, WithChildFunction, WithChildComponent, WithChildFunctionContext } from './common';

export const Components = ({title, col}) => ( // eslint-disable-line react/prop-types
  <>
    <Preview generator={WithPropFunction({title, col})} />

    <Preview>
      {WithChildFunction({title, col})}
    </Preview>

    <Preview>
      <WithChildComponent title={title} col={col} />
    </Preview>

    <Preview>
      <Context.Consumer>
        {WithChildFunctionContext({title, col})}
      </Context.Consumer>
    </Preview>
  </>
);
