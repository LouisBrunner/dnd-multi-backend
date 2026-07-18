import type {CSSProperties, JSX, RefObject} from 'react'
import {useDrop} from 'react-dnd'
import {type DragContent, useFixRDnDRef} from './common.ts'

export const Basket = ({logs}: {logs: RefObject<Element | null>}): JSX.Element => {
  const [collectedProps, drop] = useDrop<DragContent, void, {isOver: boolean; canDrop: boolean}>({
    accept: 'card',
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: (item) => {
      const message = `Dropped: ${item.color}`
      if (logs.current) {
        logs.current.innerHTML += `${message}<br />`
      }
    },
  })

  const isOver = collectedProps.isOver
  const canDrop = collectedProps.canDrop
  const style: CSSProperties = {
    backgroundColor: isOver && canDrop ? '#f3f3f3' : '#cccccc',
    border: '1px dashed black',
    display: 'inline-block',
    height: '100px',
    margin: '10px',
    width: '100px',
  }

  const dropRef = useFixRDnDRef(drop)
  return <div ref={dropRef} style={style} />
}
