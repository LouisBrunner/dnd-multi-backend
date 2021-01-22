import type {DragLayerMonitor} from 'react-dnd'

const dnd = jest.requireActual<Record<string, unknown>>('react-dnd')

let mockMonitor: DragLayerMonitor
export const __setMockMonitor = (monitor: DragLayerMonitor): void => {
  mockMonitor = monitor
}

export const useDragLayer = <CollectedProps>(collect: (monitor: DragLayerMonitor) => CollectedProps): CollectedProps => {
  return collect(mockMonitor)
}

module.exports = dnd
