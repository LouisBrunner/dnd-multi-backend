import {useCallback} from 'react'
import type {ConnectDragSource, ConnectDropTarget} from 'react-dnd'

export type DragContent = {
  color: string
}

// FIXME: issue with react-dnd when using React v19
export const useFixRDnDRef = <T extends Element>(ref: ConnectDropTarget | ConnectDragSource) =>
  useCallback(
    (node: T | null) => {
      ref(node)
    },
    [ref],
  )
