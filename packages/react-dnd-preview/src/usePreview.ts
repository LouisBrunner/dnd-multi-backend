import { CSSProperties, MutableRefObject, useRef } from 'react'
import { Identifier } from 'dnd-core'
import { DragLayerMonitor, useDragLayer } from 'react-dnd'

const getStyle = (currentOffset: Point): CSSProperties => {
  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`
  return {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    transform,
    WebkitTransform: transform,
  }
}

// Reminder:
// getInitialClientOffset: clientX/clientY when drag started
// getInitialSourceClientOffset: parent top/left bounding box when drag started
// getClientOffset: current clientX/clientY
// getSourceClientOffset: difference between parent top/left and current clientX/clientY
//  = (getClientOffset + getInitialSourceClientOffset) - getInitialClientOffset
// getDifferenceFromInitialOffset: difference between clientX/clientY when drag started and current one

type Point = {
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

const calculatePointerPosition = (monitor: DragLayerMonitor, childRef: MutableRefObject<Element | undefined>): Point | null => {
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

export type usePreviewState = {
  display: false
} | usePreviewStateFull

export type usePreviewStateFull = {
  display: true,
  ref: MutableRefObject<Element | undefined>,
} & GeneratorProps

export type GeneratorProps = {
  itemType: Identifier | null,
  item: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  style: CSSProperties,
  monitor: DragLayerMonitor,
}

export const usePreview = (): usePreviewState => {
  const child = useRef<Element | undefined>(undefined)
  const collectedProps = useDragLayer((monitor: DragLayerMonitor) => {
    return {
      currentOffset: calculatePointerPosition(monitor, child),
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem() as unknown,
      monitor,
    }
  })

  if (!collectedProps.isDragging || collectedProps.currentOffset === null) {
    return {display: false}
  }

  return {
    display: true,
    itemType: collectedProps.itemType,
    item: collectedProps.item,
    style: getStyle(collectedProps.currentOffset),
    monitor: collectedProps.monitor,
    ref: child,
  }
}
