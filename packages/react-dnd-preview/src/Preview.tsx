import React, {ReactChildren, ReactNode} from 'react'
import { usePreview } from './usePreview'
import { Context, PreviewState } from './Context'

export type PreviewGenerator = (state: PreviewState) => JSX.Element

export type PreviewProps = {
  children: PreviewGenerator | ReactChildren | ReactNode
} | {
  generator: PreviewGenerator,
}

export const Preview = (props: PreviewProps): JSX.Element | null => {
  const result = usePreview()

  if (!result.display) {
    return null
  }
  const {display: _display, ...data} = result

  let child
  if ('children' in props && (typeof props.children === 'function')) {
    child = (props.children as PreviewGenerator)(data)
  } else if ('children' in props) {
    child = props.children
  } else {
    child = props.generator(data)
  }
  return <Context.Provider value={data}>{child}</Context.Provider>
}
