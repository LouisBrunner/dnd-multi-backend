import React from 'react';
import PropTypes from 'prop-types';
import { usePreview } from './usePreview';
import { Context } from './Context';

const Preview = (props) => {
  const {display, ...data} = usePreview();

  if (!display) {
    return null;
  }

  let child;
  if (props.children && (typeof props.children === 'function')) {
    child = props.children(data);
  } else if (props.children) {
    child = props.children;
  } else {
    child = props.generator(data);
  }
  return <Context.Provider value={data}>{child}</Context.Provider>;
};

Preview.propTypes = {
  generator: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
};

export { Preview };
