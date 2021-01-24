import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

export const Shape = React.forwardRef(({style, size, color, children}, ref) => {
  return (
    <div ref={ref} style={{
      ...style,
      backgroundColor: color,
      width: `${size}px`,
      height: `${size}px`,
    }}>
      {children}
    </div>
  );
});

Shape.displayName = 'Shape';

Shape.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number,
  color: PropTypes.string,
  children: PropTypes.any,
};

export const Draggable = () => {
  const [_, drag] = useDrag({
    item: {
      type: 'thing',
      color: '#eedd00',
    },
  });
  return <Shape ref={drag} style={{}} size={100} color="blue" />;
};
