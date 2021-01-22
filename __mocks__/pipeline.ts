import {Backend} from 'dnd-core'
import {createTransition, MultiBackendOptions} from 'dnd-multi-backend'

const createBackend = () => {
  return {
    setup: jest.fn(),
    teardown: jest.fn(),
    connectDragSource: jest.fn(),
    connectDragPreview: jest.fn(),
    connectDropTarget: jest.fn(),
    profile: jest.fn(),
  }
}

export const TestBackends = [
  createBackend(),
  createBackend(),
]

export const TestPipeline: MultiBackendOptions = {
  backends: [
    {
      id: 'back1',
      backend: jest.fn((): Backend => {
        return TestBackends[0]
      }),
    },
    {
      id: 'back2',
      backend: jest.fn((): Backend => {
        return TestBackends[1]
      }),
      options: {abc: 123},
      preview: true,
      transition: createTransition('touchstart', jest.fn((event) => { return event.type === 'touchstart' })),
    },
  ],
}

export const TestPipelineWithSkip: MultiBackendOptions = {
  backends: [
    TestPipeline.backends[0],
    {
      ...TestPipeline.backends[1],
      skipDispatchOnTransition: true,
    },
  ],
}
