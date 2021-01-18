import {BackendFactory} from 'dnd-core'
import {MultiBackend} from './types'
import {MultiBackendImpl} from './MultiBackendImpl'

export const MultiFactory: BackendFactory = (manager, context, options): MultiBackend => {
  return new MultiBackendImpl(manager, context, options)
}
