import {HTML5toTouch} from 'rdndmb-html5-to-touch'
import {type CSSProperties, type JSX, type RefObject, StrictMode, useContext, useRef, useState} from 'react'
import {DndProvider as ReactDndProvider} from 'react-dnd'
import {DndProvider, MultiBackend, Preview, PreviewContext, type PreviewState, usePreview} from '../src/index.ts'

import {Basket} from './Basket.tsx'
import {Card} from './Card.tsx'
import type {DragContent} from './common.ts'
import {MultiBasket} from './MultiBasket.tsx'
import {MultiCard} from './MultiCard.tsx'

const Block = ({row, text, item, style}: {row: number; text: string; item: DragContent; style: CSSProperties}): JSX.Element => (
  <div
    style={{
      ...style,
      backgroundColor: item.color,
      height: '50px',
      top: `${row * 60}px`,
      whiteSpace: 'nowrap',
      width: '50px',
    }}
  >
    Generated {text}
  </div>
)

const ContextPreview = ({text}: {text: string}): JSX.Element => {
  const preview = useContext(PreviewContext)
  if (!preview) {
    throw new Error('missing preview context')
  }
  const {style, item} = preview as PreviewState<DragContent>
  return <Block item={item} row={0} style={style} text={`${text} with Context`} />
}

const HookPreview = ({text}: {text: string}): JSX.Element | null => {
  const preview = usePreview<DragContent>()
  if (!preview.display) {
    return null
  }
  const {style, item} = preview
  return <Block item={item} row={1} style={style} text={`${text} with Hook`} />
}

const ComponentPreview = ({text}: {text: string}): JSX.Element => (
  <Preview generator={({item, style}: PreviewState<DragContent>): JSX.Element => <Block item={item} row={2} style={style} text={`${text} with Component`} />} />
)

const Content = ({title, fref}: {title: string; fref: RefObject<HTMLDivElement | null>}) => (
  <>
    <h2>{title} API</h2>
    <Card color="#cc2211" />
    <Card color="#22cc11" />
    <Card color="#2211cc" />
    <Basket logs={fref} />

    <br />

    <MultiCard color="#33ff77" />
    <MultiBasket logs={fref} />

    <br />

    <div ref={fref} />

    <Preview>
      <ContextPreview text={title} />
    </Preview>
    <HookPreview text={title} />
    <ComponentPreview text={title} />
  </>
)

export const App = (): JSX.Element => {
  const [useNew, setAPI] = useState(true)

  const refOld = useRef<HTMLDivElement>(null)
  const refNew = useRef<HTMLDivElement>(null)

  const oldAPI = (
    <ReactDndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Content fref={refOld} title="Old" />
    </ReactDndProvider>
  )

  const newAPI = (
    <DndProvider options={HTML5toTouch}>
      <Content fref={refNew} title="New" />
    </DndProvider>
  )

  return (
    <StrictMode>
      <div>
        <input
          checked={useNew}
          id="api_selector"
          onChange={(e) => {
            setAPI(e.target.checked)
          }}
          type="checkbox"
        />
        <label htmlFor="api_selector">Use New API</label>
      </div>
      {useNew ? newAPI : oldAPI}
    </StrictMode>
  )
}
