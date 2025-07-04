import type {CSSProperties, JSX} from 'react'
import {useDrag} from 'react-dnd'
import {useFixRDnDRef} from './common.js'

export const Card = (props: {color: string}): JSX.Element => {
  const [collectedProps, drag] = useDrag({
    type: 'card',
    item: {color: props.color},
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

  const dragRef = useFixRDnDRef(drag)
  return <div style={style} ref={dragRef} />
}
