import type {JSX} from 'react'
import {usePreview} from '../../../src/index.js'
import type {DragContent} from '../../shared.js'
import {type GenPreviewLiteProps, type GenPreviewProps, generatePreview} from './common.js'

const WithHook = (props: GenPreviewProps): JSX.Element | null => {
  const preview = usePreview<DragContent, HTMLDivElement>()
  if (!preview.display) {
    return null
  }
  return generatePreview(preview, props)
}

export const Hooks = (props: GenPreviewLiteProps): JSX.Element => {
  return <WithHook method="with hook" row={0} {...props} />
}
