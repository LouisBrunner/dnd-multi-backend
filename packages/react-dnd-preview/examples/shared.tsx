import {type CSSProperties, type JSX, type ReactNode, type Ref, useCallback} from 'react'
import {useDrag} from 'react-dnd'

export type DragContent = {
  type: string
  color: string
}

export type ShapeProps = {
  style: CSSProperties
  size: number
  color: string
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

export const Shape = ({style, size, color, children, ref}: ShapeProps) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {children}
    </div>
  )
}

export const Draggable = (): JSX.Element => {
  const [_, drag] = useDrag({
    type: 'thing',
    item: {
      color: '#eedd00',
    },
  })
  // FIXME: issue with react-dnd when using React v19
  const refTrampoline = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node)
    },
    [drag],
  )
  return <Shape ref={refTrampoline} style={{}} size={100} color="blue" />
}
