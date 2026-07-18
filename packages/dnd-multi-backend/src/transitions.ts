import {createTransition} from './createTransition.ts'

export const TouchTransition = createTransition('touchstart', (rawEvent: Event) => {
  const event = rawEvent as TouchEvent
  return event.touches !== null && event.touches !== undefined
})

export const HTML5DragTransition = createTransition('dragstart', (event) => event.type.indexOf('drag') !== -1 || event.type.indexOf('drop') !== -1)

export const MouseTransition = createTransition('mousedown', (event) => event.type.indexOf('touch') === -1 && event.type.indexOf('mouse') !== -1)

export const PointerTransition = createTransition('pointerdown', (rawEvent: Event) => {
  const event = rawEvent as PointerEvent
  return event.pointerType === 'mouse'
})
