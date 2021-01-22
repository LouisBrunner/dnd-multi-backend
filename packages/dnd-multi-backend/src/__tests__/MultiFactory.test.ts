import {MultiFactory} from '../MultiFactory'
import {MultiBackendImpl} from '../MultiBackendImpl'
import type {DragDropManager} from 'dnd-core'
import {TestPipeline} from '@mocks/pipeline'

describe('MultiFactory function', () => {
  test('exports a function to create a MultiBackend', () => {
    const fakeManager: DragDropManager = {
      getMonitor: jest.fn(),
      getActions: jest.fn(),
      getRegistry: jest.fn(),
      getBackend: jest.fn(),
      dispatch: jest.fn(),
    }
    expect(MultiFactory(fakeManager, {}, TestPipeline)).toBeInstanceOf(MultiBackendImpl)
    expect(() => { MultiFactory(fakeManager, {}) }).toThrowError(Error)
  })
})
