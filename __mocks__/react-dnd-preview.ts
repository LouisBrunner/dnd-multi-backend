const preview = jest.createMockFromModule<Record<string, unknown>>('react-dnd-preview')

// TODO: replace types
type PreviewProps = {
  generator: () => JSX.Element,
}

type usePreviewState = {
  display: boolean,
}

const Preview = ({generator}: PreviewProps): JSX.Element => {
  return generator()
}

export const usePreview = (): usePreviewState => {
  return {display: true}
}

module.exports = {
  ...preview,
  Preview,
  usePreview,
}
