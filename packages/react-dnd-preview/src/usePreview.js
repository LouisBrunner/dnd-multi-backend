import { useDragLayer } from 'react-dnd';

const getStyle = (currentOffset) => {
  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;
  return {pointerEvents: 'none', position: 'fixed', top: 0, left: 0, transform, WebkitTransform: transform};
};

const usePreview = () => {
  const collectedProps = useDragLayer((monitor) => {
    return {
      currentOffset:
        !monitor.getClientOffset() || !monitor.getInitialSourceClientOffset()
          ? null
          : {
              x:
                monitor.getClientOffset().x -
                (monitor.getInitialClientOffset().x -
                  monitor.getInitialSourceClientOffset().x),
              y:
                monitor.getClientOffset().y -
                (monitor.getInitialClientOffset().y -
                  monitor.getInitialSourceClientOffset().y),
            },
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
    };
  });

  if (!collectedProps.isDragging || collectedProps.currentOffset === null) {
    return {display: false};
  }

  return {
    display: true,
    itemType: collectedProps.itemType,
    item: collectedProps.item,
    style: getStyle(collectedProps.currentOffset),
  };
};

export { usePreview };
