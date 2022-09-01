import {CSSProperties, MutableRefObject, useRef} from 'react'
import {DragLayerMonitor, useDragLayer} from 'react-dnd'
import {Identifier} from 'dnd-core'
import {calculatePointerPosition, Point} from './offsets'

const getStyle = (currentOffset: Point): CSSProperties => {
  const transform = `translate(${currentOffset.x.toFixed(1)}px, ${currentOffset.y.toFixed(1)}px)`
  return {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    transform,
    WebkitTransform: transform,
  }
}

export type usePreviewState<T = unknown, El extends Element = Element> =
  {display: false}
  | usePreviewStateFull<T, El>

export type usePreviewStateFull<T = unknown, El extends Element = Element> =
  {display: true}
  & usePreviewStateContent<T, El>

export type usePreviewStateContent<T = unknown, El extends Element = Element> = {
  ref: MutableRefObject<El | null>,
  itemType: Identifier | null,
  item: T,
  style: CSSProperties,
  monitor: DragLayerMonitor,
}

export const usePreview = <T = unknown, El extends Element = Element>(): usePreviewState<T, El> => {
  const child = useRef<El | null>(null)
  const collectedProps = useDragLayer((monitor: DragLayerMonitor<T>) => {
    return {
      currentOffset: calculatePointerPosition(monitor, child),
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
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
