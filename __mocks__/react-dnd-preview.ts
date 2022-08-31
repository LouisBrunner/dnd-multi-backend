import type {usePreviewState, PreviewProps, PreviewState} from 'react-dnd-preview'
import {MockDragMonitor} from '@mocks/mocks'

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
