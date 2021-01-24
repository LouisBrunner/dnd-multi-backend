import React, { useContext } from 'react';
import { Context } from '../../../src';
import { Shape } from '../../shared';

export const generatePreview = ({itemType, item, style}, {row, col, title, method}) => {
  return (
    <Shape color={item.color} size={50} style={{
      ...style,
      top: `${row * 60}px`,
      left: `${col * 100}px`,
      whiteSpace: 'nowrap',
    }}>
      {title}
      <br />
      Generated {itemType}
      <br />
      {method}
    </Shape>
  );
};

export const WithPropFunction = ({col, title}) => {
  return (props) => generatePreview(props, {row: 0, col, title, method: 'with prop function'});
};
export const WithChildFunction = ({col, title}) => {
  return (props) => generatePreview(props, {row: 1, col, title, method: 'with child function'});
};

export const WithChildComponent = ({col, title}) => {
  return generatePreview(useContext(Context), {row: 2, col, title, method: 'with child component (using context)'});
};

export const WithChildFunctionContext = ({col, title}) => {
  return (props) => generatePreview(props, {row: 3, col, title, method: 'with child function (using context)'});
};
