import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';

@DragLayer((monitor) => {
  return {
    currentOffset: monitor.getSourceClientOffset(), isDragging: monitor.isDragging(), itemType: monitor.getItemType(), item: monitor.getItem(),
  };
})
export default class Preview extends PureComponent {
  static defaultProps = { currentOffset: { x: 0, y: 0 }, isDragging: false, itemType: '', item: {} };
  static propTypes = {
    currentOffset: PropTypes.shape({x: PropTypes.number, y: PropTypes.number}),
    isDragging: PropTypes.bool, itemType: PropTypes.string, item: PropTypes.any, generator: PropTypes.func.isRequired,
  };
  static contextTypes = { dragDropManager: PropTypes.object };

  getStyle() {
    const transform = `translate(${this.props.currentOffset.x}px, ${this.props.currentOffset.y}px)`;
    return {pointerEvents: 'none', position: 'fixed', top: 0, left: 0, transform, WebkitTransform: transform};
  }

  render() {
    if (!this.context.dragDropManager.getBackend().previewEnabled() || !this.props.isDragging || this.props.currentOffset === null) {
      return null;
    }
    return this.props.generator(this.props.itemType, this.props.item, this.getStyle());
  }
}
