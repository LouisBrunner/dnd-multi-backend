import {BackendFactory} from 'dnd-core'
import {MultiBackendSwitcher} from './types'
import {MultiBackendImpl} from './MultiBackendImpl'

export const MultiFactory: BackendFactory = (manager, context, options): MultiBackendSwitcher => {
  return new MultiBackendImpl(manager, context, options)
}
