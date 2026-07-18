import type {BackendFactory, DragDropManager} from 'dnd-core'
import {type MultiBackendContext, MultiBackendImpl, type MultiBackendOptions} from './MultiBackendImpl.ts'
import type {MultiBackendSwitcher} from './types.ts'

export const MultiFactory: BackendFactory = (manager: DragDropManager, context: MultiBackendContext, options: MultiBackendOptions): MultiBackendSwitcher =>
  new MultiBackendImpl(manager, context, options)
