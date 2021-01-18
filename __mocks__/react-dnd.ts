import {DragLayerMonitor} from 'react-dnd'

const dnd = jest.requireActual<Record<string, unknown>>('react-dnd')

let mockMonitor: DragLayerMonitor
const __setMockMonitor = (monitor: DragLayerMonitor): void => {
  mockMonitor = monitor
}

const useDragLayer = <CollectedProps>(collect: (monitor: DragLayerMonitor) => CollectedProps): CollectedProps => {
  return collect(mockMonitor)
}

module.exports = {
  ...dnd,
  __setMockMonitor,
  useDragLayer,
}
