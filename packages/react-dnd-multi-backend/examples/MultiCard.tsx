import type {CSSProperties, JSX} from 'react'
import {useMultiDrag, type useMultiDragOneState} from '../src/index.ts'
import {type DragContent, useFixRDnDRef} from './common.ts'

type DragState = useMultiDragOneState<{isDragging: boolean}>

export const MultiCard = (props: {color: string}): JSX.Element => {
  const [
    _,
    {
      html5: [html5Props, html5Drag],
      touch: [touchProps, touchDrag],
    },
  ] = useMultiDrag<DragContent, void, {isDragging: boolean}>({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: {color: props.color},
    type: 'card',
  }) as [DragState, {html5: DragState; touch: DragState}]

  const containerStyle: CSSProperties = {
    display: 'inline-block',
    margin: '10px',
  }
  const html5DragStyle: CSSProperties = {
    backgroundColor: props.color,
    display: 'inline-block',
    height: '90px',
    margin: '5px',
    opacity: html5Props.isDragging ? 0.5 : 1,
    textAlign: 'center',
    userSelect: 'none',
    width: '90px',
  }
  const touchDragStyle: CSSProperties = {
    backgroundColor: props.color,
    display: 'inline-block',
    height: '90px',
    margin: '5px',
    opacity: touchProps.isDragging ? 0.5 : 1,
    textAlign: 'center',
    userSelect: 'none',
    width: '90px',
  }
  const html5DragRef = useFixRDnDRef(html5Drag)
  const touchDragRef = useFixRDnDRef(touchDrag)
  return (
    <div style={containerStyle}>
      <div ref={html5DragRef} style={html5DragStyle}>
        HTML5
      </div>
      <div ref={touchDragRef} style={touchDragStyle}>
        Touch
      </div>
    </div>
  )
}
