import type {CSSProperties, JSX, RefObject} from 'react'
import {useMultiDrop, type useMultiDropOneState} from '../src/index.ts'
import {type DragContent, useFixRDnDRef} from './common.ts'

type DropState = useMultiDropOneState<{isOver: boolean; canDrop: boolean}>

export const MultiBasket = ({logs}: {logs: RefObject<Element | null>}): JSX.Element => {
  const [
    _,
    {
      html5: [html5Props, html5Drop],
      touch: [touchProps, touchDrop],
    },
  ] = useMultiDrop<DragContent, void, {isOver: boolean; canDrop: boolean}>({
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
  }) as [DropState, {html5: DropState; touch: DropState}]

  const containerStyle: CSSProperties = {
    border: '1px dashed black',
    display: 'inline-block',
    margin: '10px',
  }
  const html5DropStyle: CSSProperties = {
    backgroundColor: html5Props.isOver && html5Props.canDrop ? '#f3f3f3' : '#bbbbbb',
    display: 'inline-block',
    height: '90px',
    margin: '5px',
    textAlign: 'center',
    userSelect: 'none',
    width: '90px',
  }
  const touchDropStyle: CSSProperties = {
    backgroundColor: touchProps.isOver && touchProps.canDrop ? '#f3f3f3' : '#bbbbbb',
    display: 'inline-block',
    height: '90px',
    margin: '5px',
    textAlign: 'center',
    userSelect: 'none',
    width: '90px',
  }
  const html5DropRef = useFixRDnDRef(html5Drop)
  const touchDropRef = useFixRDnDRef(touchDrop)
  return (
    <div style={containerStyle}>
      <div ref={html5DropRef} style={html5DropStyle}>
        HTML5
      </div>
      <div ref={touchDropRef} style={touchDropStyle}>
        Touch
      </div>
    </div>
  )
}
