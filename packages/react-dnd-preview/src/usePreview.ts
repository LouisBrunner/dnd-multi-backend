import type {Identifier} from 'dnd-core'
import {type CSSProperties, type RefObject, useRef} from 'react'
import {type DragLayerMonitor, useDragLayer} from 'react-dnd'
import {calculatePointerPosition, type Point, type PreviewPlacement} from './offsets.js'

const getStyle = (currentOffset: Point): CSSProperties => {
  const transform = `translate(${currentOffset.x.toFixed(1)}px, ${currentOffset.y.toFixed(1)}px)`
  return {
    left: 0,
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    transform,
    WebkitTransform: transform,
  }
}

export type usePreviewState<T = unknown, El extends Element = Element> = {display: false} | usePreviewStateFull<T, El>

export type usePreviewStateFull<T = unknown, El extends Element = Element> = {display: true} & usePreviewStateContent<T, El>

export type usePreviewStateContent<T = unknown, El extends Element = Element> = {
  ref: RefObject<El | null>
  itemType: Identifier | null
  item: T
  style: CSSProperties
  monitor: DragLayerMonitor
}

export type usePreviewOptions = {
  placement?: PreviewPlacement
  padding?: Point
}

export const usePreview = <T = unknown, El extends Element = Element>(options?: usePreviewOptions): usePreviewState<T, El> => {
  const child = useRef<El | null>(null)
  const collectedProps = useDragLayer((monitor: DragLayerMonitor<T>) => {
    return {
      currentOffset: calculatePointerPosition(monitor, child, options?.placement, options?.padding),
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      monitor,
    }
  })

  if (!collectedProps.isDragging || collectedProps.currentOffset === null) {
    return {display: false}
  }

  return {
    display: true,
    item: collectedProps.item,
    itemType: collectedProps.itemType,
    monitor: collectedProps.monitor,
    ref: child,
    style: getStyle(collectedProps.currentOffset),
  }
}
