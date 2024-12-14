import {useContext} from 'react'
import {Preview as DnDPreview, Context as PreviewContext, type PreviewProps, type PreviewState} from 'react-dnd-preview'
import {createPortal} from 'react-dom'

import {useObservePreviews} from '../hooks/useObservePreviews'
import {PreviewPortalContext} from './DndProvider'

export const Preview = <T = unknown, El extends Element = Element>(props: PreviewProps<T, El>): JSX.Element | null => {
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
export {PreviewContext}
export type {PreviewState}
