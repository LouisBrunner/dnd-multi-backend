import React from 'react';
import PropTypes from 'prop-types';
import { useMultiDrag } from '../src';

const MultiCard = (props) => {
  const [_, {html5: [html5Props, html5Drag], touch: [touchProps, touchDrag]}] = useMultiDrag({
    item: {type: 'card', color: props.color},
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const html5DragStyle = {backgroundColor: props.color, opacity: html5Props.isDragging ? 0.5 : 1};
  const touchDragStyle = {backgroundColor: props.color, opacity: touchProps.isDragging ? 0.5 : 1};
  return (
    <div className="multi-square-container">
      <div className="multi-square" style={html5DragStyle} ref={html5Drag}>HTML5</div>
      <div className="multi-square" style={touchDragStyle} ref={touchDrag}>Touch</div>
    </div>
  );
};

MultiCard.propTypes = {
  color: PropTypes.string.isRequired,
};

export default MultiCard;
