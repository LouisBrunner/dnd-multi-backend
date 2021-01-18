import { createTransition } from './createTransition'

export const TouchTransition = createTransition('touchstart', (rawEvent: Event) => {
  const event = rawEvent as TouchEvent
  return event.touches !== null && event.touches !== undefined
})

export const HTML5DragTransition = createTransition('dragstart', (event) => {
  return event.type.indexOf('drag') !== -1 || event.type.indexOf('drop') !== -1
})

export const MouseTransition = createTransition('mousedown', (event) => {
  return event.type.indexOf('touch') === -1 && event.type.indexOf('mouse') !== -1
})
