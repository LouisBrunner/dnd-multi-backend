import {MultiFactory} from '../MultiFactory'

import {MultiBackendImpl} from '../MultiBackendImpl'

describe('MultiFactory function', () => {
  test('exports a function to create a MultiBackend', () => {
    const fakeManager = {getMonitor: jest.fn(), getActions: jest.fn(), getRegistry: jest.fn(), getContext: jest.fn()}
    const pipeline = {backends: [{id: 'abc', backend: () => {}}]}
    expect(MultiFactory(fakeManager, {}, pipeline)).toBeInstanceOf(MultiBackendImpl)
    expect(() => { MultiFactory(fakeManager, {}) }).toThrowError(Error)
  })
})
