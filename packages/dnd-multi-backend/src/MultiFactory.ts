import {DragDropManager, BackendFactory} from 'dnd-core'
import {MultiBackendSwitcher} from './types'
import {MultiBackendContext, MultiBackendImpl, MultiBackendOptions} from './MultiBackendImpl'

export const MultiFactory: BackendFactory = (manager: DragDropManager, context: MultiBackendContext, options: MultiBackendOptions): MultiBackendSwitcher => {
  return new MultiBackendImpl(manager, context, options)
}
