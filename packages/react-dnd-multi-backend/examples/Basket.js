import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

const Basket = ({logs}) => {
  const [collectedProps, drop] = useDrop({
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

  const isOver = collectedProps.isOver;
  const canDrop = collectedProps.canDrop;
  const style = {
    backgroundColor: (isOver && canDrop) ? '#f3f3f3' : '#cccccc',
    border: '1px dashed black',
    display: 'inline-block',
    width: '100px',
    height: '100px',
    margin: '10px',
  };

  return <div style={style} ref={drop} />;
};

Basket.propTypes = {
  logs: PropTypes.object,
};

export default Basket;
