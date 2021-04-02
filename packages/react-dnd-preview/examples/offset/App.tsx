import React, { CSSProperties, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { usePreview } from '../../src'
import { Draggable, Shape, DragContent } from '../shared'

type Kinds = 'default' | 'ref' | 'custom_client' | 'custom_source_client'

type PreviewProps = {
  kind: Kinds,
  text: string,
}

export const Preview = ({kind, text}: PreviewProps): JSX.Element | null => {
  const preview = usePreview<DragContent, HTMLDivElement>()
  if (!preview.display) {
    return null
  }
  const {style, ref, monitor} = preview

  let finalRef, finalStyle: CSSProperties = {...style, opacity: 0.5, whiteSpace: 'nowrap'}
  if (kind === 'default') {
    // Keep as-is
  } else if (kind === 'ref') {
    finalRef = ref
  } else {
    let x, y
    if (kind === 'custom_client') {
      x = monitor.getClientOffset()?.x ?? 0
      y = monitor.getClientOffset()?.y ?? 0
    } else if (kind === 'custom_source_client') {
      x = monitor.getSourceClientOffset()?.x ?? 0
      y = monitor.getSourceClientOffset()?.y ?? 0
    } else {
      throw new Error('unknown kind')
    }
    const transform = `translate(${x}px, ${y}px)`
    finalStyle = {
      ...finalStyle,
      transform,
      WebkitTransform: transform,
    }
  }

  return <Shape ref={finalRef} style={finalStyle} size={50} color="red">{text}</Shape>
}

export const App = (): JSX.Element => {
  const [debug, setDebug] = useState(false)

  return (
    <React.StrictMode>
      <p>
        <input type="checkbox" checked={debug} onChange={(e) => {
          setDebug(e.target.checked)
        }} id="debug_mode" />
        <label htmlFor="debug_mode">Debug mode</label>
      </p>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable />
        <Preview text="default" kind="default" />
        <Preview text="with ref" kind="ref" />
        {debug ? (
          <>
            <Preview text="custom ClientOffset" kind="custom_client" />
            <Preview text="custom SourceClientOffset" kind="custom_source_client" />
          </>
        ) : null}
      </DndProvider>
    </React.StrictMode>
  )
}
