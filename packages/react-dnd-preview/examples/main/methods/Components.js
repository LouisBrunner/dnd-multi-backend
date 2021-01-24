import React from 'react';
import PropTypes from 'prop-types';
import { Preview, Context } from '../../../src';
import { WithPropFunction, WithChildFunction, WithChildComponent, WithChildFunctionContext } from './common';

export const Components = ({title, col}) => (
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

Components.propTypes = {
  title: PropTypes.string,
  col: PropTypes.number,
};
