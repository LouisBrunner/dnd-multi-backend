import {MockDragMonitor} from '@mocks/mocks'
import type {PreviewProps, PreviewState, usePreviewState} from 'react-dnd-preview'

const preview = jest.createMockFromModule<Record<string, unknown>>('react-dnd-preview')

const state: PreviewState = {
  ref: {current: null},
  itemType: 'abc',
  item: {},
  style: {},
  monitor: MockDragMonitor<unknown>(null),
}

const Preview = (props: PreviewProps): JSX.Element | null => {
  if ('children' in props) {
    return null
  }
  return props.generator(state)
}

export const usePreview = (): usePreviewState => {
  return {
    display: true,
    ...state,
  }
}

module.exports = {
  ...preview,
  Preview,
  usePreview,
}
