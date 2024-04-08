import type { usePreviewState } from '../usePreview'

let mockReturn: usePreviewState

export const __setMockReturn = (state: usePreviewState): void => {
  mockReturn = state
}

export const usePreview = (): usePreviewState => {
  return mockReturn
}
