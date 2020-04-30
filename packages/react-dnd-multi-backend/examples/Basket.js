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
  const style = {backgroundColor: (isOver && canDrop) ? '#f3f3f3' : '#cccccc', border: '1px dashed black'};

  return <div className="square" style={style} ref={drop} />;
};

Basket.propTypes = {
  logs: PropTypes.object,
};

export default Basket;
