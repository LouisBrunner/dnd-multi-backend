import React, {ReactNode} from 'react'
import {usePreview} from './usePreview'
import {Context, PreviewState} from './Context'

export type PreviewGenerator<T = unknown, El extends Element = Element> = (state: PreviewState<T, El>) => JSX.Element

export type PreviewProps<T = unknown, El extends Element = Element> = {
  children: PreviewGenerator<T, El> | ReactNode
} | {
  generator: PreviewGenerator<T, El>,
}

export const Preview = <T = unknown, El extends Element = Element>(props: PreviewProps<T, El>): JSX.Element | null => {
  const result = usePreview<T, El>()

  if (!result.display) {
    return null
  }
  const {display: _display, ...data} = result

  let child
  if ('children' in props) {
    if (typeof props.children === 'function') {
      child = (props.children as PreviewGenerator<T, El>)(data)
    } else {
      child = props.children
    }
  } else {
    child = props.generator(data)
  }
  return <Context.Provider value={data}>{child}</Context.Provider>
}
