import type {CSSProperties, JSX, RefObject} from 'react'
import {useDrop} from 'react-dnd'
import {type DragContent, useFixRDnDRef} from './common.js'

export const Basket = ({logs}: {logs: RefObject<Element | null>}): JSX.Element => {
  const [collectedProps, drop] = useDrop<DragContent, void, {isOver: boolean; canDrop: boolean}>({
    accept: 'card',
    drop: (item) => {
      const message = `Dropped: ${item.color}`
      if (logs.current) {
        logs.current.innerHTML += `${message}<br />`
      }
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }
    },
  })

  const isOver = collectedProps.isOver
  const canDrop = collectedProps.canDrop
  const style: CSSProperties = {
    backgroundColor: isOver && canDrop ? '#f3f3f3' : '#cccccc',
    border: '1px dashed black',
    display: 'inline-block',
    width: '100px',
    height: '100px',
    margin: '10px',
  }

  const dropRef = useFixRDnDRef(drop)
  return <div style={style} ref={dropRef} />
}
