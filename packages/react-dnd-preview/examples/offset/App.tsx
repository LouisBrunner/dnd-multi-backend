import {CSSProperties, StrictMode, useState} from 'react'
import {DndProvider} from 'react-dnd'
import {TouchBackend} from 'react-dnd-touch-backend'
import {usePreview, Point} from '../../src'
import type {PreviewPlacement} from '../../src/'
import {Draggable, Shape, DragContent} from '../shared'

type Kinds = 'default' | 'ref' | 'custom_client' | 'custom_source_client'

type PreviewProps = {
  kind: Kinds,
  text: string,
  placement?: PreviewPlacement,
  padding?: Point
}

export const Preview = ({kind, text, placement, padding}: PreviewProps): JSX.Element | null => {
  const preview = usePreview<DragContent, HTMLDivElement>({placement, padding})
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
  const [previewPlacement, setPreviewPlacement] = useState<PreviewPlacement>('center')

  const [paddingX, setPaddingX] = useState('0')
  const [paddingY, setPaddingY] = useState('0')

  const handlePlacementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreviewPlacement(e.target.value as PreviewPlacement)
  }

  const handlePaddingXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaddingX(e.target.value)
  }

  const handlePaddingYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaddingY(e.target.value)
  }

  return (
    <StrictMode>
      <p>
        <label htmlFor="previewPlacement">Preview placement: </label>
        <select value={previewPlacement} id="previewPlacement" onChange={handlePlacementChange}>
          <option value="center">center (default)</option>
          <option value="top-start">top-start</option>
          <option value="top">top</option>
          <option value="top-end">top-end</option>
          <option value="bottom-start">bottom-start</option>
          <option value="bottom">bottom</option>
          <option value="bottom-end">bottom-end</option>
          <option value="left">left</option>
          <option value="right">right</option>
        </select>
      </p>
      <p>
        <label htmlFor="previewPlacement">Padding x: </label>
        <input type="text" value={paddingX} onChange={handlePaddingXChange}/>
      </p>
      <p>
        <label htmlFor="previewPlacement">Padding y: </label>
        <input type="text" value={paddingY} onChange={handlePaddingYChange}/>
      </p>
      <p>
        <input type="checkbox" checked={debug} onChange={(e) => {
          setDebug(e.target.checked)
        }} id="debug_mode"/>
        <label htmlFor="debug_mode">Debug mode</label>

      </p>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable/>
        <Preview text="default" kind="default"/>
        <Preview text="with ref" kind="ref" placement={previewPlacement} padding={{x: Number(paddingX), y: Number(paddingY)}}/>
        {debug ? (
          <>
            <Preview text="custom ClientOffset" kind="custom_client"/>
            <Preview text="custom SourceClientOffset" kind="custom_source_client"/>
          </>
        ) : null}
      </DndProvider>
    </StrictMode>
  )
}
