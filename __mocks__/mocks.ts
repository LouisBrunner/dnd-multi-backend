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
    // eslint-disable-next-line id-length
    getDifferenceFromInitialOffset: jest.fn(() => { return null }),
    getSourceClientOffset: jest.fn(() => { return null }),
  }
}

type OmitThisParameters<T> = {
  [P in keyof T]: OmitThisParameter<T[P]>;
}

export type MockedPreviewList = OmitThisParameters<jest.Mocked<PreviewList>>

export const MockPreviewList = (): MockedPreviewList => {
  return {
    register: jest.fn(),
    unregister: jest.fn(),
    backendChanged: jest.fn(),
  }
}

export type MockedMultiBackend = jest.Mocked<MultiBackendSwitcher>

export const MockMultiBackend = (): MockedMultiBackend => {
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
