import {CSSProperties, forwardRef, ReactNode} from 'react'
import {useDrag} from 'react-dnd'

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
    type: 'thing',
    item: {
      color: '#eedd00',
    },
  })
  return <Shape ref={drag} style={{}} size={100} color="blue" />
}
