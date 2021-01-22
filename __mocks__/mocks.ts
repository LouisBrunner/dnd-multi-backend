import type {DragLayerMonitor} from 'react-dnd'
import type {MultiBackendSwitcher, PreviewList} from 'dnd-multi-backend'

export const MockDragMonitor = (): jest.Mocked<DragLayerMonitor> => {
  return {
    isDragging: jest.fn(() => { return false }),
    getItemType: jest.fn(() => { return null }),
    getItem: jest.fn(() => { return null }),
    getClientOffset: jest.fn(() => { return null }),
    getInitialClientOffset: jest.fn(() => { return null }),
    getInitialSourceClientOffset: jest.fn(() => { return null }),
    getDifferenceFromInitialOffset: jest.fn(() => { return null }),
    getSourceClientOffset: jest.fn(() => { return null }),
  }
}

export type MockedPreviewList = jest.Mocked<PreviewList>

export const MockPreviewList = (): MockedPreviewList => {
  return {
    register: jest.fn(),
    unregister: jest.fn(),
    backendChanged: jest.fn(),
  }
}

export const MockMultiBackend = (): jest.Mocked<MultiBackendSwitcher> => {
  return {
    backendsList: jest.fn(),
    previewsList: jest.fn(),
    previewEnabled: jest.fn(),
    setup: jest.fn(),
    teardown: jest.fn(),
    connectDragSource: jest.fn(),
    connectDragPreview: jest.fn(),
    connectDropTarget: jest.fn(),
    profile: jest.fn(),
  }
}
