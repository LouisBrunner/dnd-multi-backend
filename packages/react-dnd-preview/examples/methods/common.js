import React, { useContext } from 'react';
import { Context } from '../../src';

export const generatePreview = ({itemType, item, style}, {row, col, title, method}) => { // eslint-disable-line react/prop-types
  return (
    <div style={{
      ...style,
      backgroundColor: item.color, // eslint-disable-line react/prop-types
      width: '50px',
      height: '50px',
      top: `${row * 60}px`,
      left: `${col * 100}px`,
      whiteSpace: 'nowrap',
    }}>
      {title}
      <br />
      Generated {itemType}
      <br />
      {method}
    </div>
  );
};

export const WithPropFunction = ({col, title}) => {
  return (props) => generatePreview(props, {row: 0, col, title, method: 'with prop function'});
};
export const WithChildFunction = ({col, title}) => {
  return (props) => generatePreview(props, {row: 1, col, title, method: 'with child function'});
};

export const WithChildComponent = ({col, title}) => {
  return generatePreview(useContext(Context), {row: 2, col, title, method: 'with child component (using context'});
};

export const WithChildFunctionContext = ({col, title}) => {
  return (props) => generatePreview(props, {row: 3, col, title, method: 'with child function (using context'});
};
