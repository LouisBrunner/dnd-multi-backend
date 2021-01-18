import { useRef } from 'react';
import { useDragLayer } from 'react-dnd';

const getStyle = (currentOffset) => {
  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;
  return {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    transform,
    WebkitTransform: transform,
  };
};

// Reminder:
// getInitialClientOffset: clientX/clientY when drag started
// getInitialSourceClientOffset: parent top/left bounding box when drag started
// getClientOffset: current clientX/clientY
// getSourceClientOffset: difference between parent top/left and current clientX/clientY
//  = (getClientOffset + getInitialSourceClientOffset) - getInitialClientOffset
// getDifferenceFromInitialOffset: difference between clientX/clientY when drag started and current one

const subtract = (a, b) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

const calculateParentOffset = (monitor) => {
  if (!monitor.getInitialClientOffset() || !monitor.getInitialSourceClientOffset()) {
    return {x: 0, y: 0};
  }
  return subtract(monitor.getInitialClientOffset(), monitor.getInitialSourceClientOffset());
};

const calculatePointerPosition = (monitor, childRef) => {
  if (!monitor.getClientOffset()) {
    return null;
  }

  // If we don't have a reference to a valid child, use the default offset:
  // current cursor - initial parent/drag source offset
  if (!childRef.current || !childRef.current.getBoundingClientRect) {
    return subtract(monitor.getClientOffset(), calculateParentOffset(monitor));
  }

  const bb = childRef.current.getBoundingClientRect();
  const middle = {x: bb.width / 2, y: bb.height / 2};
  return subtract(monitor.getClientOffset(), middle);
};

export const usePreview = () => {
  const child = useRef();
  const collectedProps = useDragLayer((monitor) => {
    return {
      currentOffset: calculatePointerPosition(monitor, child),
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
      monitor,
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
    monitor: collectedProps.monitor,
    ref: child,
  };
};
