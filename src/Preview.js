// @Wrap: (component) =>
//   displayName = component.displayName or component.name or 'Component'
//
//   return class HybridBackendWrapper extends React.Component
//     @DecoratedComponent = component
//     @displayName = "HybridBackend(#{displayName})"
//
//     @contextTypes: dragDropManager: React.PropTypes.object
//
//     componentDidMount: =>
//       @context.dragDropManager.getBackend().mountComponent(@refs.actual)
//
//     componentWillUnmount: =>
//       @context.dragDropManager.getBackend().unmountComponent(@refs.actual)
//
//     render: => React.createElement(component, Object.assign({}, @props, ref: 'actual'))
//
// @CollectPreview: (monitor) => currentOffset: monitor.getSourceClientOffset(), isDragging: monitor.isDragging(), itemType: monitor.getItemType(), item: monitor.getItem()
//
// class _Preview extends React.Component
//   @defaultProps: currentOffset: {x: 0, y: 0}, isDragging: false, itemType: '', item: ''
//   @propTypes: currentOffset: React.PropTypes.shape(x: React.PropTypes.number, y: React.PropTypes.number), isDragging: React.PropTypes.bool, itemType: React.PropTypes.string, item: React.PropTypes.object, generator: React.PropTypes.func
//
//   getStyle: =>
//     transform = "translate(#{@props.currentOffset.x}px, #{@props.currentOffset.y}px)"
//     pointerEvents: 'none', position: 'fixed', top: 0, left: 0, transform: transform, WebkitTransform: transform
//
//   render: =>
//     return null if HybridBackend.Backend == 0 or not @props.isDragging or not @props.currentOffset?.x?
//     @props.generator(@props.type, @props.item, @getStyle())
//
// @Preview: ReactDnD.DragLayer(@CollectPreview)(_Preview)
