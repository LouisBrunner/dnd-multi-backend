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

  const containerStyle = {
    display: 'inline-block',
    margin: '10px',
  };
  const html5DragStyle = {
    backgroundColor: props.color,
    opacity: html5Props.isDragging ? 0.5 : 1,
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  };
  const touchDragStyle = {
    backgroundColor: props.color,
    opacity: touchProps.isDragging ? 0.5 : 1,
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  };
  return (
    <div style={containerStyle}>
      <div style={html5DragStyle} ref={html5Drag}>HTML5</div>
      <div style={touchDragStyle} ref={touchDrag}>Touch</div>
    </div>
  );
};

MultiCard.propTypes = {
  color: PropTypes.string.isRequired,
};

export default MultiCard;
