import { CSSProperties, RefCallback, RefObject, useRef } from 'react'
import { DragLayerMonitor, DragObjectWithType, DragSourceHookSpec, useDragLayer } from 'react-dnd'
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

export type usePreviewState<T extends DragObjectWithType = DragObjectWithType, El extends Element = Element> =
 {display: false}
 | usePreviewStateFull<T, El>

export type usePreviewStateFull<T extends DragObjectWithType = DragObjectWithType, El extends Element = Element> = {
  display: true,
} & usePreviewStateContent<T, El>

type DragSpec<T extends DragObjectWithType> = DragSourceHookSpec<T, unknown, unknown>

export type usePreviewStateContent<T extends DragObjectWithType = DragObjectWithType, El extends Element = Element> = {
  ref: RefCallback<El> | RefObject<El>,
  itemType: DragSpec<T>['item']['type'] | null,
  item: T,
  style: CSSProperties,
  monitor: DragLayerMonitor,
}

export const usePreview = <T extends DragObjectWithType = DragObjectWithType, El extends Element = Element>(): usePreviewState<T, El> => {
  const child = useRef<El>(null)
  const collectedProps = useDragLayer((monitor: DragLayerMonitor) => {
    return {
      currentOffset: calculatePointerPosition(monitor, child),
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem() as T,
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
