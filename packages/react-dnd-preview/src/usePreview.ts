import { CSSProperties, MutableRefObject, useRef } from 'react'
import { Identifier } from 'dnd-core'
import { DragLayerMonitor, useDragLayer } from 'react-dnd'
import { calculatePointerPosition, Point } from './offsets'

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

export type usePreviewState =
 usePreviewStateEmpty
 | usePreviewStateDisplay

export type usePreviewStateEmpty = {
  display: false,
}

export type usePreviewStateDisplay = ({
  display: true,
  ref: MutableRefObject<Element | undefined>,
} & GeneratorProps)

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
