import type {CSSProperties, JSX} from 'react'
import {useDrag} from 'react-dnd'
import {useFixRDnDRef} from './common.ts'

export const Card = (props: {color: string}): JSX.Element => {
  const [collectedProps, drag] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: {color: props.color},
    type: 'card',
  })
  const isDragging = collectedProps.isDragging
  const style: CSSProperties = {
    backgroundColor: props.color,
    display: 'inline-block',
    height: '100px',
    margin: '10px',
    opacity: isDragging ? 0.5 : 1,
    width: '100px',
  }

  const dragRef = useFixRDnDRef(drag)
  return <div ref={dragRef} style={style} />
}
