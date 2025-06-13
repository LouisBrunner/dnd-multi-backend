export {MultiFactory as MultiBackend} from './MultiFactory.js'

export {createTransition} from './createTransition.js'
export {
  HTML5DragTransition,
  TouchTransition,
  MouseTransition,
  PointerTransition,
} from './transitions.js'

export type {
  MultiBackendOptions,
  MultiBackendPipeline,
  MultiBackendPipelineStep,
  MultiBackendContext,
} from './MultiBackendImpl.js'

export type {
  MultiBackendSwitcher,
  PreviewList,
  PreviewListener,
  BackendEntry,
  Transition,
} from './types.js'
