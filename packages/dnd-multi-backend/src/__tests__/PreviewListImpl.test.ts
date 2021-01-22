import {DragDropManager} from 'dnd-core'
import {MultiBackendSwitcher, PreviewList} from '../types'
import { PreviewListImpl } from '../PreviewListImpl'
import {MultiBackendImpl} from '../MultiBackendImpl'
import {TestPipeline} from '@mocks/pipeline'

describe('PreviewListImpl class', () => {
  let list: PreviewList
  let mb: MultiBackendSwitcher

  beforeEach(() => {
    list = new PreviewListImpl()
    mb = new MultiBackendImpl(undefined as unknown as DragDropManager, undefined, TestPipeline)
  })

  const createPreview = () => {
    return {backendChanged: jest.fn()}
  }

  test('does nothing when empty', () => {
    expect(() => { list.backendChanged(mb) }).not.toThrow()
  })

  test('notifies registered previews', () => {
    const preview1 = createPreview()
    const preview2 = createPreview()
    list.register(preview1)
    list.register(preview2)
    list.backendChanged(mb)
    expect(preview1.backendChanged).toHaveBeenCalledWith(mb)
    expect(preview2.backendChanged).toHaveBeenCalledWith(mb)
    list.unregister(preview1)
    list.unregister(preview2)
  })

  test('stops notifying after unregistering', () => {
    const preview1 = createPreview(), preview2 = createPreview()
    list.register(preview1)
    list.register(preview2)
    list.backendChanged(mb)
    expect(preview1.backendChanged).toHaveBeenCalledTimes(1)
    expect(preview2.backendChanged).toHaveBeenCalledTimes(1)
    list.unregister(preview2)
    list.backendChanged(mb)
    expect(preview1.backendChanged).toHaveBeenCalledTimes(2)
    expect(preview2.backendChanged).toHaveBeenCalledTimes(1)
    list.unregister(preview1)
  })
})
