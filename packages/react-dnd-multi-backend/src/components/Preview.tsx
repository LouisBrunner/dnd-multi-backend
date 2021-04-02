import React, { useContext } from 'react'
import {createPortal} from 'react-dom'
import { Preview as DnDPreview, PreviewProps, Context as PreviewContext, PreviewState } from 'react-dnd-preview'
import {DragObjectWithType} from 'react-dnd'

import {useObservePreviews} from '../hooks/useObservePreviews'
import { PreviewPortalContext } from './DndProvider'

export const Preview = <T extends DragObjectWithType = DragObjectWithType, El extends Element = Element>(props: PreviewProps<T, El>): JSX.Element | null => {
  const enabled = useObservePreviews()
  const portal = useContext<Element | null>(PreviewPortalContext)
  if (!enabled) {
    return null
  }

  const result = <DnDPreview<T, El> {...props} />
  if (portal !== null) {
    return createPortal(result, portal)
  }
  return result
}

Preview.Context = PreviewContext
export { PreviewContext }
export type { PreviewState }
