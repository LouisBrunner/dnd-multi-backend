import type {MultiBackendSwitcher, PreviewList} from 'dnd-multi-backend'
import type {DragLayerMonitor} from 'react-dnd'

export const MockDragMonitor = <DragObject = unknown>(item: DragObject): jest.Mocked<DragLayerMonitor<DragObject>> => {
  return {
    isDragging: jest.fn(() => {
      return false
    }),
    getItemType: jest.fn(() => {
      return null
    }),
    // FIXME: why is it failing to get the type correct?
    getItem: jest.fn(() => {
      return item
    }) as jest.MockInstance<DragObject, []> & (<T = DragObject>() => T),
    getClientOffset: jest.fn(() => {
      return null
    }),
    getInitialClientOffset: jest.fn(() => {
      return null
    }),
    getInitialSourceClientOffset: jest.fn(() => {
      return null
    }),
    getDifferenceFromInitialOffset: jest.fn(() => {
      return null
    }),
    getSourceClientOffset: jest.fn(() => {
      return null
    }),
  }
}

type OmitThisParameters<T> = {
  [P in keyof T]: OmitThisParameter<T[P]>
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
