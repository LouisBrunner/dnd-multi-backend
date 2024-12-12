import type {RefObject} from 'react'
import type {DragLayerMonitor} from 'react-dnd'

// Reminder:
// getInitialClientOffset: clientX/clientY when drag started
// getInitialSourceClientOffset: parent top/left bounding box when drag started
// getClientOffset: current clientX/clientY
// getSourceClientOffset: difference between parent top/left and current clientX/clientY
//  = (getClientOffset + getInitialSourceClientOffset) - getInitialClientOffset
// getDifferenceFromInitialOffset: difference between clientX/clientY when drag started and current one

export type Point = {
  x: number
  y: number
}

export type PreviewPlacement = 'center' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right'

const subtract = (a: Point, b: Point): Point => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}

const add = (a: Point, b: Point): Point => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
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

const calculateXOffset = (placement: PreviewPlacement, bb: DOMRect): number => {
  switch (placement) {
    case 'left':
    case 'top-start':
    case 'bottom-start':
      return 0
    case 'right':
    case 'top-end':
    case 'bottom-end':
      return bb.width
    default:
      return bb.width / 2
  }
}

const calculateYOffset = (placement: PreviewPlacement, bb: DOMRect): number => {
  switch (placement) {
    case 'top':
    case 'top-start':
    case 'top-end':
      return 0
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      return bb.height
    default:
      return bb.height / 2
  }
}

export const calculatePointerPosition = (monitor: DragLayerMonitor, childRef: RefObject<Element>, placement: PreviewPlacement = 'center', padding: Point = {x: 0, y: 0}): Point | null => {
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
  const previewOffset = {x: calculateXOffset(placement, bb), y: calculateYOffset(placement, bb)}

  return add(subtract(offset, previewOffset), padding)
}
