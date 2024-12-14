import type {ReactNode} from 'react'
import {Context, type PreviewState} from './Context'
import type {Point, PreviewPlacement} from './offsets'
import {usePreview} from './usePreview'

export type PreviewGenerator<T = unknown, El extends Element = Element> = (state: PreviewState<T, El>) => JSX.Element

export type PreviewProps<T = unknown, El extends Element = Element> = (
  | {
      children: PreviewGenerator<T, El> | ReactNode
    }
  | {
      generator: PreviewGenerator<T, El>
    }
) & {
  placement?: PreviewPlacement
  padding?: Point
}

export const Preview = <T = unknown, El extends Element = Element>(props: PreviewProps<T, El>): JSX.Element | null => {
  const result = usePreview<T, El>({
    placement: props.placement,
    padding: props.padding,
  })

  if (!result.display) {
    return null
  }
  const {display: _display, ...data} = result

  let child: ReactNode
  if ('children' in props) {
    if (typeof props.children === 'function') {
      child = props.children(data)
    } else {
      child = props.children
    }
  } else {
    child = props.generator(data)
  }
  return <Context.Provider value={data}>{child}</Context.Provider>
}
