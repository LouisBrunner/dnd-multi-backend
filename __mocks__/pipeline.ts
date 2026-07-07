import {jest} from 'bun:test'
import type {Backend} from 'dnd-core'
import {createTransition, type MultiBackendOptions} from 'dnd-multi-backend'
import {createMock} from './mocks'

export const TestBackends = [createMock<Backend>(), createMock<Backend>()]

export const TestPipeline: MultiBackendOptions = {
  backends: [
    {
      backend: jest.fn((): Backend => {
        return TestBackends[0]
      }),
      id: 'back1',
    },
    {
      backend: jest.fn((): Backend => {
        return TestBackends[1]
      }),
      id: 'back2',
      options: {abc: 123},
      preview: true,
      transition: createTransition(
        'touchstart',
        jest.fn((event) => {
          return event.type === 'touchstart'
        }),
      ),
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
