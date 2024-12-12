import {type ConnectDropTarget, type DropTargetHookSpec, useDrop} from 'react-dnd'
import {useMultiCommon} from './useMultiCommon'

export type useMultiDropOneState<Props> = [Props, ConnectDropTarget]

export type useMultiDropState<Props> = [useMultiDropOneState<Props>, Record<string, useMultiDropOneState<Props>>]

export const useMultiDrop = <Drag, Drop, Props>(spec: DropTargetHookSpec<Drag, Drop, Props>): useMultiDropState<Props> => {
  return useMultiCommon<DropTargetHookSpec<Drag, Drop, Props>, useMultiDropOneState<Props>>(spec, useDrop)
}
