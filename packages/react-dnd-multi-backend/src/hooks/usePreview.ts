import {usePreview as usePreviewDnd, type usePreviewOptions, type usePreviewState} from 'react-dnd-preview'

import {useObservePreviews} from './useObservePreviews.ts'

export type {usePreviewState, usePreviewStateContent} from 'react-dnd-preview'

export const usePreview = <T = unknown, El extends Element = Element>(props?: usePreviewOptions): usePreviewState<T, El> => {
  const enabled = useObservePreviews()
  const result = usePreviewDnd<T, El>(props)
  if (!enabled) {
    return {display: false}
  }
  return result
}
