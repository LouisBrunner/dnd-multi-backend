import React from 'react';
import PropTypes from 'prop-types';
import { useDragLayer } from 'react-dnd';

const PreviewContext = React.createContext();

const getStyle = (currentOffset) => {
  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;
  return {pointerEvents: 'none', position: 'fixed', top: 0, left: 0, transform, WebkitTransform: transform};
};

const Preview = (props) => {
  const collectedProps = useDragLayer((monitor) => {
    return {
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
    };
  });

  if (!collectedProps.isDragging || collectedProps.currentOffset === null) {
    return null;
  }

  const data = {
    itemType: collectedProps.itemType,
    item: collectedProps.item,
    style: getStyle(collectedProps.currentOffset),
  };

  let child;
  if (props.children && (typeof props.children === 'function')) {
    child = props.children(data);
  } else if (props.children) {
    child = props.children;
  } else {
    child = props.generator(data);
  }
  return <PreviewContext.Provider value={data}>{child}</PreviewContext.Provider>;
};

Preview.propTypes = {
  generator: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
};

export const Context = PreviewContext;
export default Preview;
