import {Transition} from './types'

export const createTransition = (event: Transition['event'], check: Transition['check']): Transition => {
  return {
    event,
    check,
  }
}
