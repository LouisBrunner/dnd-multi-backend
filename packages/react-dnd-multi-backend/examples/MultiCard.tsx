import type {CSSProperties, JSX} from 'react'
import {useMultiDrag} from '../src'
import {type DragContent, useFixRDnDRef} from './common'

export const MultiCard = (props: {color: string}): JSX.Element => {
  const [
    _,
    {
      html5: [html5Props, html5Drag],
      touch: [touchProps, touchDrag],
    },
  ] = useMultiDrag<DragContent, void, {isDragging: boolean}>({
    type: 'card',
    item: {color: props.color},
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })

  const containerStyle: CSSProperties = {
    display: 'inline-block',
    margin: '10px',
  }
  const html5DragStyle: CSSProperties = {
    backgroundColor: props.color,
    opacity: html5Props.isDragging ? 0.5 : 1,
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  }
  const touchDragStyle: CSSProperties = {
    backgroundColor: props.color,
    opacity: touchProps.isDragging ? 0.5 : 1,
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  }
  const html5DragRef = useFixRDnDRef(html5Drag)
  const touchDragRef = useFixRDnDRef(touchDrag)
  return (
    <div style={containerStyle}>
      <div style={html5DragStyle} ref={html5DragRef}>
        HTML5
      </div>
      <div style={touchDragStyle} ref={touchDragRef}>
        Touch
      </div>
    </div>
  )
}
