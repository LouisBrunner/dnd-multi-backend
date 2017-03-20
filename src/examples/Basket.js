import React, { PropTypes, createClass } from 'react';
import { DropTarget } from 'react-dnd';

const spec = {
  drop: function (props, monitor) {
    // eslint-disable-next-line no-console
    console.log('Dropped: ' + monitor.getItem().color);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const Basket = createClass({
  propTypes: {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  },

  render: function () {
    const isOver = this.props.isOver;
    const canDrop = this.props.canDrop;
    const connectDropTarget = this.props.connectDropTarget;
    const style = { backgroundColor: (isOver && canDrop) ? '#f3f3f3' : '#cccccc', border: '1px dashed black' };

    return connectDropTarget(<div className="square" style={style} />);
  }
});

module.exports = DropTarget('square', spec, collect)(Basket);
