import type {CSSProperties, JSX, RefObject} from 'react'
import {useMultiDrop} from '../src'
import {type DragContent, useFixRDnDRef} from './common'

export const MultiBasket = ({logs}: {logs: RefObject<Element | null>}): JSX.Element => {
  const [
    _,
    {
      html5: [html5Props, html5Drop],
      touch: [touchProps, touchDrop],
    },
  ] = useMultiDrop<DragContent, void, {isOver: boolean; canDrop: boolean}>({
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

  // TODO: replace with autoprefixer+astroturf
  const containerStyle: CSSProperties = {
    border: '1px dashed black',
    display: 'inline-block',
    margin: '10px',
  }
  const html5DropStyle: CSSProperties = {
    backgroundColor: html5Props.isOver && html5Props.canDrop ? '#f3f3f3' : '#bbbbbb',
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  }
  const touchDropStyle: CSSProperties = {
    backgroundColor: touchProps.isOver && touchProps.canDrop ? '#f3f3f3' : '#bbbbbb',
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  }
  const html5DropRef = useFixRDnDRef(html5Drop)
  const touchDropRef = useFixRDnDRef(touchDrop)
  return (
    <div style={containerStyle}>
      <div style={html5DropStyle} ref={html5DropRef}>
        HTML5
      </div>
      <div style={touchDropStyle} ref={touchDropRef}>
        Touch
      </div>
    </div>
  )
}
