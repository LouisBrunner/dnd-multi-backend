import React from 'react'
import { usePreview } from '../../../src'
import {DragContent} from '../../shared'
import { generatePreview, GenPreviewLiteProps, GenPreviewProps } from './common'

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
