import React, { useContext } from 'react'
import {createPortal} from 'react-dom'
import { Preview as DnDPreview, PreviewProps, Context as PreviewContext } from 'react-dnd-preview'

import {useObservePreviews} from '../hooks/useObservePreviews'
import { PreviewPortalContext } from './DndProvider'

export const Preview = (props: PreviewProps): JSX.Element | null => {
  const enabled = useObservePreviews()
  const portal = useContext<Element | null>(PreviewPortalContext)
  if (!enabled) {
    return null
  }

  const result = <DnDPreview {...props} />
  if (portal !== null) {
    return createPortal(result, portal)
  }
  return result
}

Preview.Context = PreviewContext
export { PreviewContext }
