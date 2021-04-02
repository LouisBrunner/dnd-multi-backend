import React, {ReactChildren, ReactNode} from 'react'
import { usePreview } from './usePreview'
import { Context, PreviewState } from './Context'
import {DragObjectWithType} from 'react-dnd'

export type PreviewGenerator<T extends DragObjectWithType = DragObjectWithType, El extends Element = Element> = (state: PreviewState<T, El>) => JSX.Element

export type PreviewProps<T extends DragObjectWithType = DragObjectWithType, El extends Element = Element> = {
  children: PreviewGenerator<T, El> | ReactChildren | ReactNode
} | {
  generator: PreviewGenerator<T, El>,
}

export const Preview = <T extends DragObjectWithType = DragObjectWithType, El extends Element = Element>(props: PreviewProps<T, El>): JSX.Element | null => {
  const result = usePreview<T, El>()

  if (!result.display) {
    return null
  }
  const {display: _display, ...data} = result

  let child
  if ('children' in props && (typeof props.children === 'function')) {
    child = (props.children as PreviewGenerator<T, El>)(data)
  } else if ('children' in props) {
    child = props.children
  } else {
    child = props.generator(data)
  }
  return <Context.Provider value={data}>{child}</Context.Provider>
}
