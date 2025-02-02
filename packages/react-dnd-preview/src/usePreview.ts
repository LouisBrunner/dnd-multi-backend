import type {Identifier} from 'dnd-core'
import {type CSSProperties, type MutableRefObject, useRef} from 'react'
import {type DragLayerMonitor, useDragLayer} from 'react-dnd'
import {type Point, type PreviewPlacement, calculatePointerPosition} from './offsets'

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

export type usePreviewState<T = unknown, El extends Element = Element> = {display: false} | usePreviewStateFull<T, El>

export type usePreviewStateFull<T = unknown, El extends Element = Element> = {display: true} & usePreviewStateContent<T, El>

export type usePreviewStateContent<T = unknown, El extends Element = Element> = {
  ref: MutableRefObject<El | null>
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
