import {jest} from 'bun:test'
import type {Backend} from 'dnd-core'
import {createTransition, type MultiBackendOptions, type MultiBackendPipelineStep} from 'dnd-multi-backend/index.ts'
import {createMock, type Mocked} from './mocks.ts'

export const TestBackends: [Backend & Mocked<Backend>, Backend & Mocked<Backend>] = [createMock<Backend>(), createMock<Backend>()]

const backend1: MultiBackendPipelineStep = {
  backend: jest.fn((): Backend => TestBackends[0]),
  id: 'back1',
}

const backend2: MultiBackendPipelineStep = {
  backend: jest.fn((): Backend => TestBackends[1]),
  id: 'back2',
  options: {abc: 123},
  preview: true,
  transition: createTransition(
    'touchstart',
    jest.fn((event) => event.type === 'touchstart'),
  ),
}

export const TestPipeline: MultiBackendOptions = {
  backends: [backend1, backend2],
}

export const TestPipelineWithSkip: MultiBackendOptions = {
  backends: [
    backend1,
    {
      ...backend2,
      skipDispatchOnTransition: true,
    },
  ],
}
