import {usePreview as usePreviewDnd, type usePreviewState, type usePreviewStateContent} from 'react-dnd-preview'

import {useObservePreviews} from './useObservePreviews'

export type {usePreviewState, usePreviewStateContent}

export const usePreview = <T = unknown, El extends Element = Element>(): usePreviewState<T, El> => {
  const enabled = useObservePreviews()
  const result = usePreviewDnd<T, El>()
  if (!enabled) {
    return {display: false}
  }
  return result
}
