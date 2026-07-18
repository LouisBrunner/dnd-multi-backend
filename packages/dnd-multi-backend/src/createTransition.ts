import type {Transition} from './types.ts'

export const createTransition = (event: Transition['event'], check: Transition['check']): Transition => ({
  check,
  event,
})
