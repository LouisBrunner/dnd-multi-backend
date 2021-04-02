import React, {CSSProperties, forwardRef, ReactNode} from 'react'
import { useDrag } from 'react-dnd'

export type DragContent = {
  type: string,
  color: string,
}

export type ShapeProps = {
  style: CSSProperties,
  size: number,
  color: string,
  children?: ReactNode
}

// FIXME: silly forwardRef stuff
// eslint-disable-next-line react/prop-types
export const Shape = forwardRef<HTMLDivElement, ShapeProps>(({style, size, color, children}, ref) => {
  return (
    <div ref={ref} style={{
      ...style,
      backgroundColor: color,
      width: `${size}px`,
      height: `${size}px`,
    }}>
      {children}
    </div>
  )
})

Shape.displayName = 'Shape'

export const Draggable = (): JSX.Element => {
  const [_, drag] = useDrag({
    item: {
      type: 'thing',
      color: '#eedd00',
    },
  })
  return <Shape ref={drag} style={{}} size={100} color="blue" />
}
