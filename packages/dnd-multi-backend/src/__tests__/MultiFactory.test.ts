import {TestPipeline} from '@mocks/pipeline'
import type {DragDropManager} from 'dnd-core'
import {MultiBackendImpl} from '../MultiBackendImpl'
import {MultiFactory} from '../MultiFactory'

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
    expect(() => {
      MultiFactory(fakeManager, {})
    }).toThrow(Error)
  })
})
