import PropTypes from 'prop-types';
import { useDragLayer } from 'react-dnd-cjs';

const getStyle = (props) => {
  const transform = `translate(${props.currentOffset.x}px, ${props.currentOffset.y}px)`;
  return {pointerEvents: 'none', position: 'fixed', top: 0, left: 0, transform, WebkitTransform: transform};
};

const Preview = (props) => {
  const collectedProps = useDragLayer({
    collect: (monitor) => {
      return {
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
        itemType: monitor.getItemType(),
        item: monitor.getItem(),
      };
    },
  });

  if (!collectedProps.isDragging || collectedProps.currentOffset === null) {
    return null;
  }
  return props.generator(this.props.itemType, this.props.item, getStyle(collectedProps));
};

Preview.propTypes = {
  generator: PropTypes.func.isRequired,
};

export default Preview;
