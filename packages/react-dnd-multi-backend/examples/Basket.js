import React from 'react';
import { useDrop } from 'react-dnd-cjs';

const Basket = () => {
  const [collectedProps, drop] = useDrop({
    accept: 'card',
    drop: (item) => {
      const message = `Dropped: ${item.color}`;
      document.getElementById('console').innerHTML += `${message}<br />`;
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

export default Basket;
