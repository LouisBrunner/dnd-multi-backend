import {usePreview} from '../../../src'
import type {DragContent} from '../../shared'
import {type GenPreviewLiteProps, type GenPreviewProps, generatePreview} from './common'

import type {JSX} from 'react'

const WithHook = (props: GenPreviewProps): JSX.Element | null => {
  const preview = usePreview<DragContent, HTMLDivElement>()
  if (!preview.display) {
    return null
  }
  return generatePreview(preview, props)
}

export const Hooks = (props: GenPreviewLiteProps): JSX.Element => {
  return (
    <>
      <WithHook row={0} method="with hook" {...props} />
    </>
  )
}
