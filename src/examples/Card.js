import React, { PropTypes, createClass } from 'react';
import { DragSource } from 'react-dnd';

const spec = {
  beginDrag: function (props) {
    return {color: props.color};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const Card = createClass({
  propTypes: {
    color: PropTypes.string.isRequired,

    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
  },

  render: function () {
    var isDragging = this.props.isDragging;
    var connectDragSource = this.props.connectDragSource;
    var style = { backgroundColor: this.props.color, opacity: isDragging ? 0.5 : 1 };

    return connectDragSource(<div className="square" style={style} />);
  }
});

module.exports = DragSource('square', spec, collect)(Card);
