import React from 'react';
import { DragSource } from 'react-dnd';
const PropTypes = React.PropTypes;

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

const Card = React.createClass({
  propTypes: {
    color: PropTypes.string.isRequired,

    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
  },

  render: function () {
    var isDragging = this.props.isDragging;
    var connectDragSource = this.props.connectDragSource;
    var color = this.props.color;
    var style = { width: '100px', height: '100px', backgroundColor: this.props.color, opacity: isDragging ? 0.5 : 1 };

    return connectDragSource(<div style={style} />);
  }
});

module.exports = DragSource('square', spec, collect)(Card);
