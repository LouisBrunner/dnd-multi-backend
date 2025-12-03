import type {BackendFactory, DragDropManager} from 'dnd-core'
import {type MultiBackendContext, MultiBackendImpl, type MultiBackendOptions} from './MultiBackendImpl.js'
import type {MultiBackendSwitcher} from './types.js'

export const MultiFactory: BackendFactory = (manager: DragDropManager, context: MultiBackendContext, options: MultiBackendOptions): MultiBackendSwitcher => {
  return new MultiBackendImpl(manager, context, options)
}
