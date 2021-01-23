import { DOMWindow } from 'jsdom'
import {DragDropManager} from 'dnd-core'
import {MultiBackendContext, MultiBackendImpl, MultiBackendOptions} from '../MultiBackendImpl'
import {TestBackends, TestPipeline, TestPipelineWithSkip} from '@mocks/pipeline'

const globalNode = global as unknown as {
  window: DOMWindow | undefined,
}

describe('MultiBackendImpl class', () => {
  let _defaultManager: DragDropManager
  let _defaultContext: MultiBackendContext

  beforeEach(() => {
    jest.clearAllMocks()
    _defaultManager = {
      getMonitor: jest.fn(),
      getActions: jest.fn(),
      getRegistry: jest.fn(),
      getBackend: jest.fn(),
      dispatch: jest.fn(),
    }
    _defaultContext = {qrt: Math.random()}
  })

  const createBackend = (pipeline: MultiBackendOptions = TestPipeline) => {
    return new MultiBackendImpl(_defaultManager, _defaultContext, pipeline)
  }

  const switchTouchBackend = (): void => {
    expect(TestBackends[0].teardown).not.toHaveBeenCalled()
    expect(TestBackends[1].setup).not.toHaveBeenCalled()
    // eslint-disable-next-line compat/compat
    const event = new TouchEvent('touchstart', {bubbles: true, touches: []})
    window.dispatchEvent(event)
    expect(TestBackends[0].teardown).toHaveBeenCalled()
    expect(TestBackends[1].setup).toHaveBeenCalled()
  }

  describe('constructor', () => {
    let warn: jest.SpyInstance

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation()
    })

    afterEach(() => {
      warn.mockRestore()
    })

    test('fails if no backend are specified', () => {
      const pipeline = {backends: []}
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).toThrowError(Error)
    })

    test('fails if no backend are specified (prototype trick)', () => {
      const pipeline = Object.create({backends: []}) as Record<string, unknown>
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).toThrowError(Error)
    })

    test('fails if a backend lacks the `backend` property', () => {
      const pipeline = {backends: [{}]}
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).toThrowError(Error)
    })

    test('fails if a backend specifies an invalid `transition` property', () => {
      const pipeline = {backends: [{backend: () => {}, transition: {}}]}
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).toThrowError(Error)
    })

    test('fails if a backend lacks an `id` property and one cannot be infered', () => {
      const pipeline = {backends: [{backend: () => {}}]}
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).toThrowError(Error)
    })

    test('fails if a backend has a duplicate `id` property', () => {
      const pipeline = {backends: [
        {id: 'abc', backend: () => {}},
        {id: 'abc', backend: () => {}},
      ]}
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).toThrowError(Error)
    })

    test('warns if a backend lacks an `id` property but one can be infered', () => {
      const pipeline = {backends: [{backend: () => { return {} }}]}
      expect(() => { createBackend(pipeline as unknown as MultiBackendOptions) }).not.toThrow()
      expect(warn).toHaveBeenCalled()
    })

    test('constructs correctly', () => {
      const pipeline = TestPipeline
      createBackend(pipeline)

      expect(pipeline.backends[0].backend).toHaveBeenCalledTimes(1)
      expect(pipeline.backends[0].backend).toBeCalledWith(_defaultManager, _defaultContext, undefined)

      expect(pipeline.backends[1].backend).toHaveBeenCalledTimes(1)
      expect(pipeline.backends[1].backend).toBeCalledWith(_defaultManager, _defaultContext, pipeline.backends[1].options)
    })
  })


  describe('setup function', () => {
    test('does nothing if it has no window', () => {
      const spyAdd = jest.spyOn(window, 'addEventListener')

      const oldWindow = globalNode.window
      delete globalNode.window

      const backend = createBackend()
      backend.setup()
      expect(() => { backend.setup() }).not.toThrow()
      expect(spyAdd).not.toHaveBeenCalled()
      expect(TestBackends[0].setup).not.toHaveBeenCalled()

      backend.teardown()

      globalNode.window = oldWindow

      spyAdd.mockRestore()
    })

    test('fails if a backend already exist', () => {
      const spyAdd = jest.spyOn(window, 'addEventListener')

      const backend = createBackend()
      expect(TestBackends[0].setup).not.toHaveBeenCalled()
      backend.setup()
      expect(TestBackends[0].setup).toHaveBeenCalled()
      expect(spyAdd).toHaveBeenCalledWith('touchstart', expect.any(Function))

      TestBackends[0].setup.mockClear()
      spyAdd.mockClear()

      const backend2 = createBackend()
      expect(TestBackends[0].setup).not.toHaveBeenCalled()
      expect(() => { backend2.setup() }).toThrowError(Error)
      expect(TestBackends[0].setup).not.toHaveBeenCalled()
      expect(spyAdd).not.toHaveBeenCalled()

      backend.teardown()
      spyAdd.mockRestore()
    })

    test('sets up the events and sub-backends', () => {
      const spyAdd = jest.spyOn(window, 'addEventListener')

      const backend = createBackend()
      expect(TestBackends[0].setup).not.toHaveBeenCalled()
      backend.setup()
      expect(TestBackends[0].setup).toHaveBeenCalled()
      expect(spyAdd).toHaveBeenCalledWith('touchstart', expect.any(Function))

      backend.teardown()
      spyAdd.mockRestore()
    })
  })

  describe('teardown function', () => {
    test('does nothing if it has no window', () => {
      const spyRemove = jest.spyOn(window, 'removeEventListener')

      const oldWindow = globalNode.window
      delete globalNode.window

      const backend = createBackend()
      backend.setup()
      backend.teardown()
      expect(spyRemove).not.toHaveBeenCalled()
      expect(TestBackends[0].teardown).not.toHaveBeenCalled()

      globalNode.window = oldWindow

      spyRemove.mockRestore()
    })

    test('cleans up the events and sub-backends', () => {
      const spyRemove = jest.spyOn(window, 'removeEventListener')

      const backend = createBackend()
      backend.setup()
      expect(TestBackends[0].teardown).not.toHaveBeenCalled()
      backend.teardown()
      expect(TestBackends[0].teardown).toHaveBeenCalled()
      expect(spyRemove).toHaveBeenCalledWith('touchstart', expect.any(Function))

      spyRemove.mockRestore()
    })

    test('can recreate a second backend', () => {
      const spyRemove = jest.spyOn(window, 'removeEventListener')

      const backend = createBackend()
      backend.setup()
      expect(TestBackends[0].teardown).not.toHaveBeenCalled()
      backend.teardown()
      expect(TestBackends[0].teardown).toHaveBeenCalled()
      expect(spyRemove).toHaveBeenCalledWith('touchstart', expect.any(Function))

      TestBackends[0].teardown.mockClear()
      spyRemove.mockClear()

      const backend2 = createBackend()
      backend2.setup()
      expect(TestBackends[0].teardown).not.toHaveBeenCalled()
      backend2.teardown()
      expect(TestBackends[0].teardown).toHaveBeenCalled()
      expect(spyRemove).toHaveBeenCalledWith('touchstart', expect.any(Function))

      spyRemove.mockRestore()
    })
  })


  describe('connectDragSource function', () => {
    test('pass data correctly', () => {
      const unsub = jest.fn()
      const backend = createBackend()
      TestBackends[0].connectDragSource.mockReturnValue(unsub)
      expect(TestBackends[0].connectDragSource).not.toHaveBeenCalled()
      const wrappedUnsub = backend.connectDragSource(1, 2, 3)
      expect(TestBackends[0].connectDragSource).toHaveBeenCalledWith(1, 2, 3)
      expect(unsub).not.toHaveBeenCalled()
      wrappedUnsub()
      expect(unsub).toHaveBeenCalled()
    })

    test('handles backend switch correctly', () => {
      const unsub1 = jest.fn()
      TestBackends[0].connectDragSource.mockReturnValue(unsub1)

      const unsub2 = jest.fn()
      TestBackends[1].connectDragSource.mockReturnValue(unsub2)

      const backend = createBackend()
      backend.setup()

      expect(TestBackends[0].connectDragSource).not.toHaveBeenCalled()
      const wrappedUnsub = backend.connectDragSource(1, 2, 3)
      expect(TestBackends[0].connectDragSource).toHaveBeenCalledWith(1, 2, 3)

      expect(TestBackends[1].connectDragSource).not.toHaveBeenCalled()
      switchTouchBackend()
      expect(unsub1).toHaveBeenCalled()
      expect(TestBackends[1].connectDragSource).toHaveBeenCalledWith(1, 2, 3)

      expect(unsub2).not.toHaveBeenCalled()
      wrappedUnsub()
      expect(unsub2).toHaveBeenCalled()

      backend.teardown()
    })
  })

  describe('connectDragPreview function', () => {
    test('pass data correctly', () => {
      const unsub = jest.fn()
      const backend = createBackend()
      TestBackends[0].connectDragPreview.mockReturnValue(unsub)
      expect(TestBackends[0].connectDragPreview).not.toHaveBeenCalled()
      const wrappedUnsub = backend.connectDragPreview(1, 2, 3)
      expect(TestBackends[0].connectDragPreview).toHaveBeenCalledWith(1, 2, 3)
      expect(unsub).not.toHaveBeenCalled()
      wrappedUnsub()
      expect(unsub).toHaveBeenCalled()
    })

    test('handles backend switch correctly', () => {
      const unsub1 = jest.fn()
      TestBackends[0].connectDragPreview.mockReturnValue(unsub1)

      const unsub2 = jest.fn()
      TestBackends[1].connectDragPreview.mockReturnValue(unsub2)

      const backend = createBackend()
      backend.setup()

      expect(TestBackends[0].connectDragPreview).not.toHaveBeenCalled()
      const wrappedUnsub = backend.connectDragPreview(1, 2, 3)
      expect(TestBackends[0].connectDragPreview).toHaveBeenCalledWith(1, 2, 3)

      expect(TestBackends[1].connectDragPreview).not.toHaveBeenCalled()
      switchTouchBackend()
      expect(unsub1).toHaveBeenCalled()
      expect(TestBackends[1].connectDragPreview).toHaveBeenCalledWith(1, 2, 3)

      expect(unsub2).not.toHaveBeenCalled()
      wrappedUnsub()
      expect(unsub2).toHaveBeenCalled()

      backend.teardown()
    })
  })

  describe('connectDropTarget function', () => {
    test('pass data correctly', () => {
      const unsub = jest.fn()
      const backend = createBackend()
      TestBackends[0].connectDropTarget.mockReturnValue(unsub)
      expect(TestBackends[0].connectDropTarget).not.toHaveBeenCalled()
      const wrappedUnsub = backend.connectDropTarget(1, 2, 3)
      expect(TestBackends[0].connectDropTarget).toHaveBeenCalledWith(1, 2, 3)
      expect(unsub).not.toHaveBeenCalled()
      wrappedUnsub()
      expect(unsub).toHaveBeenCalled()
    })

    test('handles backend switch correctly', () => {
      const unsub1 = jest.fn()
      TestBackends[0].connectDropTarget.mockReturnValue(unsub1)

      const unsub2 = jest.fn()
      TestBackends[1].connectDropTarget.mockReturnValue(unsub2)

      const backend = createBackend()
      backend.setup()

      expect(TestBackends[0].connectDropTarget).not.toHaveBeenCalled()
      const wrappedUnsub = backend.connectDropTarget(1, 2, 3)
      expect(TestBackends[0].connectDropTarget).toHaveBeenCalledWith(1, 2, 3)

      expect(TestBackends[1].connectDropTarget).not.toHaveBeenCalled()
      switchTouchBackend()
      expect(unsub1).toHaveBeenCalled()
      expect(TestBackends[1].connectDropTarget).toHaveBeenCalledWith(1, 2, 3)

      expect(unsub2).not.toHaveBeenCalled()
      wrappedUnsub()
      expect(unsub2).toHaveBeenCalled()

      backend.teardown()
    })
  })


  describe('profile function', () => {
    test('returns the profiling data', () => {
      const data = {abc: 123} as Record<string, number>
      TestBackends[0].profile.mockReturnValue(data)

      const backend = createBackend()

      expect(TestBackends[0].profile).not.toHaveBeenCalled()
      expect(backend.profile()).toBe(data)
      expect(TestBackends[0].profile).toHaveBeenCalledWith()
    })
  })

  describe('previewEnabled/previewsList functions', () => {
    test('returns the current backend preview attribute', () => {
      const backend = createBackend()
      backend.setup()
      expect(backend.previewEnabled()).toBe(false)
      switchTouchBackend()
      expect(backend.previewEnabled()).toBe(true)

      backend.teardown()
    })

    test('notifies the preview list', () => {
      const listener = {
        backendChanged: jest.fn(),
      }

      const backend = createBackend()
      backend.previewsList().register(listener)
      backend.setup()
      expect(listener.backendChanged).not.toHaveBeenCalled()
      switchTouchBackend()
      expect(listener.backendChanged).toHaveBeenCalledWith(backend)

      backend.teardown()
    })
  })

  describe('backendsList function', () => {
    test('returns the backends list based on the pipeline', () => {
      const backend = createBackend()
      expect(backend.backendsList()[0].id).toBe(TestPipeline.backends[0].id)
    })
  })

  describe('#backendSwitcher function', () => {
    test('does not skip the transition', () => {
      const handler = jest.fn()
      window.addEventListener('touchstart', handler)

      const backend = createBackend(TestPipeline)
      backend.setup()
      switchTouchBackend()
      expect(handler).toHaveBeenCalledTimes(2)
      backend.teardown()

      window.removeEventListener('touchstart', handler)
    })

    test('skips the transition', () => {
      const handler = jest.fn()
      window.addEventListener('touchstart', handler)

      const backend = createBackend(TestPipelineWithSkip)
      backend.setup()
      switchTouchBackend()
      expect(handler).toHaveBeenCalledTimes(1)
      backend.teardown()

      window.removeEventListener('touchstart', handler)
    })
  })
})
