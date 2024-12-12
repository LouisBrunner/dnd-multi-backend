import type {BackendFactory, DragDropManager, Unsubscribe} from 'dnd-core'
import {PreviewListImpl} from './PreviewListImpl'
import type {BackendEntry, MultiBackendSwitcher, PreviewList, Transition} from './types'

interface EventConstructor {
  new (type: string, eventInitDict?: EventInit): Event
}

type DnDNode = {
  func: ConnectFunction
  args: [unknown, unknown?, unknown?]
  unsubscribe: Unsubscribe
}

type ConnectFunction = 'connectDragSource' | 'connectDragPreview' | 'connectDropTarget'

export type MultiBackendContext = unknown

export type MultiBackendPipelineStep = {
  id: string
  backend: BackendFactory
  transition?: Transition
  preview?: boolean
  skipDispatchOnTransition?: boolean
  options?: unknown
}

export type MultiBackendPipeline = MultiBackendPipelineStep[]

export type MultiBackendOptions = {
  backends: MultiBackendPipeline
}

export class MultiBackendImpl implements MultiBackendSwitcher {
  private static /*#*/ isSetUp = false

  /*private*/ #current: string
  /*private*/ #previews: PreviewList
  /*private*/ #backends: Record<string, BackendEntry>
  /*private*/ #backendsList: BackendEntry[]
  /*private*/ #nodes: Record<string, DnDNode>

  constructor(manager: DragDropManager, context?: MultiBackendContext, options?: MultiBackendOptions) {
    if (!options || !options.backends || options.backends.length < 1) {
      throw new Error(
        `You must specify at least one Backend, if you are coming from 2.x.x (or don't understand this error)
        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-2xx`,
      )
    }

    this.#previews = new PreviewListImpl()

    this.#backends = {}
    this.#backendsList = []
    for (const backend of options.backends) {
      const backendRecord = this.#createBackend(manager, context, backend)
      this.#backends[backendRecord.id] = backendRecord
      this.#backendsList.push(backendRecord)
    }
    this.#current = this.#backendsList[0].id

    this.#nodes = {}
  }

  #createBackend = (manager: DragDropManager, context: MultiBackendContext, backend: MultiBackendPipelineStep): BackendEntry => {
    if (!backend.backend) {
      throw new Error(`You must specify a 'backend' property in your Backend entry: ${JSON.stringify(backend)}`)
    }

    const instance = backend.backend(manager, context, backend.options)

    let id = backend.id
    // Try to infer an `id` if one doesn't exist
    const inferName = !backend.id && instance && instance.constructor
    if (inferName) {
      id = instance.constructor.name
    }
    if (!id) {
      throw new Error(
        `You must specify an 'id' property in your Backend entry: ${JSON.stringify(backend)}
        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-5xx`,
      )
    }
    if (inferName) {
      console.warn(
        `Deprecation notice: You are using a pipeline which doesn't include backends' 'id'.
        This might be unsupported in the future, please specify 'id' explicitely for every backend.`,
      )
    }
    if (this.#backends[id]) {
      throw new Error(
        `You must specify a unique 'id' property in your Backend entry:
        ${JSON.stringify(backend)} (conflicts with: ${JSON.stringify(this.#backends[id])})`,
      )
    }

    return {
      id,
      instance,
      preview: backend.preview ?? false,
      transition: backend.transition,
      skipDispatchOnTransition: backend.skipDispatchOnTransition ?? false,
    }
  }

  // DnD Backend API
  setup = (): void => {
    if (typeof window === 'undefined') {
      return
    }

    if (MultiBackendImpl.isSetUp) {
      throw new Error('Cannot have two MultiBackends at the same time.')
    }
    MultiBackendImpl.isSetUp = true
    this.#addEventListeners(window)
    this.#backends[this.#current].instance.setup()
  }

  teardown = (): void => {
    if (typeof window === 'undefined') {
      return
    }

    MultiBackendImpl.isSetUp = false
    this.#removeEventListeners(window)
    this.#backends[this.#current].instance.teardown()
  }

  connectDragSource = (sourceId: unknown, node?: unknown, options?: unknown): Unsubscribe => {
    return this.#connectBackend('connectDragSource', sourceId, node, options)
  }

  connectDragPreview = (sourceId: unknown, node?: unknown, options?: unknown): Unsubscribe => {
    return this.#connectBackend('connectDragPreview', sourceId, node, options)
  }

  connectDropTarget = (sourceId: unknown, node?: unknown, options?: unknown): Unsubscribe => {
    return this.#connectBackend('connectDropTarget', sourceId, node, options)
  }

  profile = (): Record<string, number> => {
    return this.#backends[this.#current].instance.profile()
  }

  // Used by Preview component
  previewEnabled = (): boolean => {
    return this.#backends[this.#current].preview
  }

  previewsList = (): PreviewList => {
    return this.#previews
  }

  backendsList = (): BackendEntry[] => {
    return this.#backendsList
  }

  // Multi Backend Listeners
  #addEventListeners = (target: EventTarget): void => {
    for (const backend of this.#backendsList) {
      if (backend.transition) {
        target.addEventListener(backend.transition.event, this.#backendSwitcher)
      }
    }
  }

  #removeEventListeners = (target: EventTarget): void => {
    for (const backend of this.#backendsList) {
      if (backend.transition) {
        target.removeEventListener(backend.transition.event, this.#backendSwitcher)
      }
    }
  }

  // Switching logic
  #backendSwitcher = (event: Event): void => {
    const oldBackend = this.#current

    this.#backendsList.some((backend) => {
      if (backend.id !== this.#current && backend.transition && backend.transition.check(event)) {
        this.#current = backend.id
        return true
      }
      return false
    })

    if (this.#current !== oldBackend) {
      this.#backends[oldBackend].instance.teardown()
      for (const [_, node] of Object.entries(this.#nodes)) {
        node.unsubscribe()
        node.unsubscribe = this.#callBackend(node.func, ...node.args)
      }
      this.#previews.backendChanged(this)

      const newBackend = this.#backends[this.#current]
      newBackend.instance.setup()

      if (newBackend.skipDispatchOnTransition) {
        return
      }

      const Class = event.constructor as EventConstructor
      const newEvent = new Class(event.type, event)
      event.target?.dispatchEvent(newEvent)
    }
  }

  #callBackend = (func: ConnectFunction, sourceId: unknown, node?: unknown, options?: unknown): Unsubscribe => {
    return this.#backends[this.#current].instance[func](sourceId, node, options)
  }

  #connectBackend = (func: ConnectFunction, sourceId: unknown, node?: unknown, options?: unknown): Unsubscribe => {
    const nodeId = `${func}_${sourceId as number}`
    const unsubscribe = this.#callBackend(func, sourceId, node, options)
    this.#nodes[nodeId] = {
      func,
      args: [sourceId, node, options],
      unsubscribe,
    }

    return (): void => {
      this.#nodes[nodeId].unsubscribe()
      delete this.#nodes[nodeId]
    }
  }
}
