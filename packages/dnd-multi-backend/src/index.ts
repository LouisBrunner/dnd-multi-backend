export {MultiFactory as MultiBackend} from './MultiFactory'

export {createTransition} from './createTransition'
export {
  HTML5DragTransition,
  TouchTransition,
  MouseTransition,
  PointerTransition,
} from './transitions'

export type {
  MultiBackendOptions,
  MultiBackendPipeline,
  MultiBackendPipelineStep,
  MultiBackendContext,
} from './MultiBackendImpl'

export type {
  MultiBackendSwitcher,
  PreviewList,
  PreviewListener,
  BackendEntry,
  Transition,
} from './types'
