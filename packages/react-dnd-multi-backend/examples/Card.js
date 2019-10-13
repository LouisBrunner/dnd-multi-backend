import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const spec = {
  beginDrag: (props) => {
    return {color: props.color};
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class Card extends PureComponent {
  static propTypes = {
    color: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
  }

  render() {
    const isDragging = this.props.isDragging;
    const connectDragSource = this.props.connectDragSource;
    const style = { backgroundColor: this.props.color, opacity: isDragging ? 0.5 : 1 };
    return connectDragSource(<div className="square" style={style} />);
  }
}

export default DragSource('square', spec, collect)(Card);
