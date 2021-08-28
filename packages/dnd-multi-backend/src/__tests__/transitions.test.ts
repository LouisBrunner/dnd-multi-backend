/* eslint-disable compat/compat */

// FIXME: jsdom still doesn't support pointer events...
class PointerEventFake extends MouseEvent {
  readonly height: number;
  readonly isPrimary: boolean;
  readonly pointerId: number;
  readonly pointerType: string;
  readonly pressure: number;
  readonly tangentialPressure: number;
  readonly tiltX: number;
  readonly tiltY: number;
  readonly twist: number;
  readonly width: number;

  private coalescedEvents: PointerEvent[];
  private predictedEvents: PointerEvent[];

  // eslint-disable-next-line complexity
  constructor(type: string, props?: PointerEventInit) {
    super(type, props)

    const rprops = props ?? {}

    this.height = rprops.height ?? 1
    this.isPrimary = rprops.isPrimary ?? false
    this.pointerId = rprops.pointerId ?? 1
    this.pointerType = rprops.pointerType ?? 'mouse'
    this.pressure = rprops.pressure ?? 0.5
    this.tangentialPressure = rprops.tangentialPressure ?? 0
    this.tiltX = rprops.tiltX ?? 0
    this.tiltY = rprops.tiltY ?? 0
    this.twist = rprops.twist ?? 0
    this.width = rprops.width ?? 1

    this.coalescedEvents = rprops.coalescedEvents ?? []
    this.predictedEvents = rprops.predictedEvents ?? []
  }

  getCoalescedEvents(): PointerEvent[] {
    return this.coalescedEvents
  }

  getPredictedEvents(): PointerEvent[] {
    return this.predictedEvents
  }
}
global.PointerEvent = PointerEventFake

import {HTML5DragTransition, TouchTransition, MouseTransition, PointerTransition} from '../transitions'

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
