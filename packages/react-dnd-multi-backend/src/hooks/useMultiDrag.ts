import { ConnectDragSource, ConnectDragPreview, DragObjectWithType, DragSourceHookSpec, useDrag } from 'react-dnd'
import { useMultiCommon } from './useMultiCommon'

export type useMultiDragOneState<Props> = [Props, ConnectDragSource, ConnectDragPreview]

export type useMultiDragState<Props> = [
  useMultiDragOneState<Props>,
  Record<string, useMultiDragOneState<Props>>,
]

export const useMultiDrag = <Drag extends DragObjectWithType, Drop, Props>(spec: DragSourceHookSpec<Drag, Drop, Props>): useMultiDragState<Props> => {
  return useMultiCommon<DragSourceHookSpec<Drag, Drop, Props>, useMultiDragOneState<Props>>(spec, useDrag)
}
