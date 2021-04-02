import {DragObjectWithType} from 'react-dnd'
import { usePreview as usePreviewDnd, usePreviewState, usePreviewStateContent } from 'react-dnd-preview'

import { useObservePreviews } from './useObservePreviews'

export type {usePreviewState, usePreviewStateContent}

export const usePreview = <T extends DragObjectWithType = DragObjectWithType, El extends Element = Element>(): usePreviewState<T, El> => {
  const enabled = useObservePreviews()
  const result = usePreviewDnd<T, El>()
  if (!enabled) {
    return {display: false}
  }
  return result
}
