import type {JSX} from 'react'
import {usePreview} from '../../../src/index.ts'
import type {DragContent} from '../../shared.tsx'
import {type GenPreviewLiteProps, type GenPreviewProps, generatePreview} from './common.tsx'

const WithHook = (props: GenPreviewProps): JSX.Element | null => {
  const preview = usePreview<DragContent, HTMLDivElement>()
  if (!preview.display) {
    return null
  }
  return generatePreview(preview, props)
}

export const Hooks = (props: GenPreviewLiteProps): JSX.Element => <WithHook method="with hook" row={0} {...props} />
