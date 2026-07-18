import {describe, expect, test} from 'bun:test'

import {HTML5DragTransition, MouseTransition, PointerTransition, TouchTransition} from '../transitions.ts'

describe('Transitions collection', () => {
  const fakeDragEvent = (type: string): Event => {
    const event = document.createEvent('Event')
    event.initEvent(type, true, true)
    return event
  }

  describe('HTML5DragTransition', () => {
    test('calls createTransition correctly', () => {
      expect(HTML5DragTransition.event).toBe('dragstart')

      expect(HTML5DragTransition.check(fakeDragEvent('dragenter'))).toBe(true)
      expect(HTML5DragTransition.check(fakeDragEvent('drop'))).toBe(true)
      expect(HTML5DragTransition.check(new TouchEvent('touchstart'))).toBe(false)
    })
  })

  describe('TouchTransition', () => {
    test('calls createTransition correctly', () => {
      expect(TouchTransition.event).toBe('touchstart')

      expect(TouchTransition.check(new TouchEvent('touchstart'))).toBe(true)
      expect(TouchTransition.check(new MouseEvent('mousemove'))).toBe(false)
    })
  })

  describe('MouseTransition', () => {
    test('calls createTransition correctly', () => {
      expect(MouseTransition.event).toBe('mousedown')

      expect(MouseTransition.check(new TouchEvent('touchstart'))).toBe(false)
      expect(MouseTransition.check(fakeDragEvent('dragenter'))).toBe(false)
      expect(MouseTransition.check(new MouseEvent('mousemove'))).toBe(true)
    })
  })

  describe('PointerTransition', () => {
    test('calls createTransition correctly', () => {
      expect(PointerTransition.event).toBe('pointerdown')

      expect(PointerTransition.check(new TouchEvent('touchstart'))).toBe(false)
      expect(PointerTransition.check(fakeDragEvent('dragenter'))).toBe(false)
      expect(PointerTransition.check(new MouseEvent('mousemove'))).toBe(false)
      expect(PointerTransition.check(new PointerEvent('pointerdown', {pointerType: 'mouse'}))).toBe(true)
    })
  })
})
