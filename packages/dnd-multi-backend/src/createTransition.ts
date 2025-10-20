import type {Transition} from './types.js'

export const createTransition = (event: Transition['event'], check: Transition['check']): Transition => {
  return {
    event,
    check,
  }
}
