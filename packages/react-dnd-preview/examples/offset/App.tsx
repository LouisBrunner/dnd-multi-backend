import {type CSSProperties, type JSX, type Ref, StrictMode, useState} from 'react'
import {DndProvider} from 'react-dnd'
import {TouchBackend} from 'react-dnd-touch-backend'
import {type Point, type PreviewPlacement, usePreview} from '../../src/index.ts'
import {type DragContent, Draggable, Shape} from '../shared.tsx'

type Kinds = 'default' | 'ref' | 'custom_client' | 'custom_source_client'

type PreviewProps = {
  kind: Kinds
  text: string
  placement?: PreviewPlacement
  padding?: Point
}

export const Preview = ({kind, text, placement, padding}: PreviewProps): JSX.Element | null => {
  const preview = usePreview<DragContent, HTMLDivElement>({padding, placement})
  if (!preview.display) {
    return null
  }
  const {style, ref, monitor} = preview

  let finalRef: Ref<HTMLDivElement> | undefined
  let finalStyle: CSSProperties = {...style, opacity: 0.5, whiteSpace: 'nowrap'}
  if (kind === 'default') {
    // Keep as-is
  } else if (kind === 'ref') {
    finalRef = ref
  } else {
    let x: number
    let y: number
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
      // biome-ignore lint/style/useNamingConvention: CSSProperties requires this exact key
      WebkitTransform: transform,
    }
  }

  return (
    <Shape color="red" ref={finalRef} size={50} style={finalStyle}>
      {text}
    </Shape>
  )
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
        <select id="previewPlacement" onChange={handlePlacementChange} value={previewPlacement}>
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
        <input onChange={handlePaddingXChange} type="text" value={paddingX} />
      </p>
      <p>
        <label htmlFor="previewPlacement">Padding y: </label>
        <input onChange={handlePaddingYChange} type="text" value={paddingY} />
      </p>
      <p>
        <input
          checked={debug}
          id="debug_mode"
          onChange={(e) => {
            setDebug(e.target.checked)
          }}
          type="checkbox"
        />
        <label htmlFor="debug_mode">Debug mode</label>
      </p>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable />
        <Preview kind="default" text="default" />
        <Preview kind="ref" padding={{x: Number(paddingX), y: Number(paddingY)}} placement={previewPlacement} text="with ref" />
        {debug ? (
          <>
            <Preview kind="custom_client" text="custom ClientOffset" />
            <Preview kind="custom_source_client" text="custom SourceClientOffset" />
          </>
        ) : null}
      </DndProvider>
    </StrictMode>
  )
}
