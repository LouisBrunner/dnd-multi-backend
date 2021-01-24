import { MutableRefObject } from 'react'
import { DragLayerMonitor } from 'react-dnd'

// Reminder:
// getInitialClientOffset: clientX/clientY when drag started
// getInitialSourceClientOffset: parent top/left bounding box when drag started
// getClientOffset: current clientX/clientY
// getSourceClientOffset: difference between parent top/left and current clientX/clientY
//  = (getClientOffset + getInitialSourceClientOffset) - getInitialClientOffset
// getDifferenceFromInitialOffset: difference between clientX/clientY when drag started and current one

export type Point = {
  x: number,
  y: number,
}

const subtract = (a: Point, b: Point): Point => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

const calculateParentOffset = (monitor: DragLayerMonitor): Point => {
  const client = monitor.getInitialClientOffset()
  const source = monitor.getInitialSourceClientOffset()
  if (client === null || source === null) {
    return {x: 0, y: 0}
  }
  return subtract(client, source)
}

export const calculatePointerPosition = (monitor: DragLayerMonitor, childRef: MutableRefObject<Element | undefined>): Point | null => {
  const offset = monitor.getClientOffset()
  if (offset === null) {
    return null
  }

  // If we don't have a reference to a valid child, use the default offset:
  // current cursor - initial parent/drag source offset
  if (!childRef.current || !childRef.current.getBoundingClientRect) {
    return subtract(offset, calculateParentOffset(monitor))
  }

  const bb = childRef.current.getBoundingClientRect()
  const middle = {x: bb.width / 2, y: bb.height / 2}
  return subtract(offset, middle)
}
