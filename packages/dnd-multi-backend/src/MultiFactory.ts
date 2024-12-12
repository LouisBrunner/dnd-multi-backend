import type {BackendFactory, DragDropManager} from 'dnd-core'
import {type MultiBackendContext, MultiBackendImpl, type MultiBackendOptions} from './MultiBackendImpl'
import type {MultiBackendSwitcher} from './types'

export const MultiFactory: BackendFactory = (manager: DragDropManager, context: MultiBackendContext, options: MultiBackendOptions): MultiBackendSwitcher => {
  return new MultiBackendImpl(manager, context, options)
}
