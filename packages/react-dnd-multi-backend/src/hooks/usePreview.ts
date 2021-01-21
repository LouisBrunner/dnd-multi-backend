import { usePreview as usePreviewDnd, usePreviewState } from 'react-dnd-preview'

import { useObservePreviews } from './useObservePreviews'

export const usePreview = (): usePreviewState => {
  const enabled = useObservePreviews()
  const result = usePreviewDnd()
  if (!enabled) {
    return {display: false}
  }
  return result
}
