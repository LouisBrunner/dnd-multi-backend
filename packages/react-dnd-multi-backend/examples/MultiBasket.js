import React from 'react';
import PropTypes from 'prop-types';
import { useMultiDrop } from '../src';

const MultiBasket = ({logs}) => {
  const [_, {html5: [html5Props, html5Drop], touch: [touchProps, touchDrop]}] = useMultiDrop({
    accept: 'card',
    drop: (item) => {
      const message = `Dropped: ${item.color}`;
      logs.current.innerHTML += `${message}<br />`;
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const containerStyle = {border: '1px dashed black'};
  const html5DropStyle = {backgroundColor: (html5Props.isOver && html5Props.canDrop) ? '#f3f3f3' : '#bbbbbb'};
  const touchDropStyle = {backgroundColor: (touchProps.isOver && touchProps.canDrop) ? '#f3f3f3' : '#bbbbbb'};
  return (
    <div className="multi-square-container" style={containerStyle}>
      <div className="multi-square" style={html5DropStyle} ref={html5Drop}>HTML5</div>
      <div className="multi-square" style={touchDropStyle} ref={touchDrop}>Touch</div>
    </div>
  );
};

MultiBasket.propTypes = {
  logs: PropTypes.object,
};

export default MultiBasket;
