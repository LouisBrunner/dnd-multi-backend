import {describe, expect, jest, test} from 'bun:test'
import {TestPipeline} from '@mocks/pipeline.js'
import type {DragDropManager} from 'dnd-core'
import {MultiBackendImpl} from '../MultiBackendImpl.js'
import {MultiFactory} from '../MultiFactory.js'

describe('MultiFactory function', () => {
  test('exports a function to create a MultiBackend', () => {
    const fakeManager: DragDropManager = {
      dispatch: jest.fn(),
      getActions: jest.fn(),
      getBackend: jest.fn(),
      getMonitor: jest.fn(),
      getRegistry: jest.fn(),
    }
    expect(MultiFactory(fakeManager, {}, TestPipeline)).toBeInstanceOf(MultiBackendImpl)
    expect(() => {
      MultiFactory(fakeManager, {})
    }).toThrow(Error)
  })
})
