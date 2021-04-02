import React, {CSSProperties} from 'react'
import { useDrag } from 'react-dnd'

export const Card = (props: {color: string}): JSX.Element => {
  const [collectedProps, drag] = useDrag({
    item: {type: 'card', color: props.color},
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })
  const isDragging = collectedProps.isDragging
  const style: CSSProperties = {
    backgroundColor: props.color,
    opacity: isDragging ? 0.5 : 1,
    display: 'inline-block',
    width: '100px',
    height: '100px',
    margin: '10px',
  }

  return <div style={style} ref={drag} />
}
