import {type CSSProperties, type JSX, type RefObject, StrictMode, useContext, useRef, useState} from 'react'
import {DndProvider as ReactDndProvider} from 'react-dnd'

import {HTML5toTouch} from 'rdndmb-html5-to-touch'
import {DndProvider, MultiBackend, Preview, PreviewContext, type PreviewState, usePreview} from '../src/index.js'

import {Basket} from './Basket.js'
import {Card} from './Card.js'
import {MultiBasket} from './MultiBasket.js'
import {MultiCard} from './MultiCard.js'
import type {DragContent} from './common.js'

const Block = ({row, text, item, style}: {row: number; text: string; item: DragContent; style: CSSProperties}): JSX.Element => {
  return (
    <div
      style={{
        ...style,
        top: `${row * 60}px`,
        backgroundColor: item.color,
        width: '50px',
        height: '50px',
        whiteSpace: 'nowrap',
      }}
    >
      Generated {text}
    </div>
  )
}

const ContextPreview = ({text}: {text: string}): JSX.Element => {
  const preview = useContext(PreviewContext)
  if (!preview) {
    throw new Error('missing preview context')
  }
  const {style, item} = preview as PreviewState<DragContent>
  return <Block row={0} text={`${text} with Context`} item={item} style={style} />
}

const HookPreview = ({text}: {text: string}): JSX.Element | null => {
  const preview = usePreview<DragContent>()
  if (!preview.display) {
    return null
  }
  const {style, item} = preview
  return <Block row={1} text={`${text} with Hook`} item={item} style={style} />
}

const ComponentPreview = ({text}: {text: string}): JSX.Element => {
  return (
    <Preview
      generator={({item, style}: PreviewState<DragContent>): JSX.Element => {
        return <Block row={2} text={`${text} with Component`} item={item} style={style} />
      }}
    />
  )
}

const Content = ({title, fref}: {title: string; fref: RefObject<HTMLDivElement | null>}) => {
  return (
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
}

export const App = (): JSX.Element => {
  const [useNew, setAPI] = useState(true)

  const refOld = useRef<HTMLDivElement>(null)
  const refNew = useRef<HTMLDivElement>(null)

  const oldAPI = (
    <ReactDndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Content title="Old" fref={refOld} />
    </ReactDndProvider>
  )

  const newAPI = (
    <DndProvider options={HTML5toTouch}>
      <Content title="New" fref={refNew} />
    </DndProvider>
  )

  return (
    <StrictMode>
      <div>
        <input
          id="api_selector"
          type="checkbox"
          checked={useNew}
          onChange={(e) => {
            setAPI(e.target.checked)
          }}
        />
        <label htmlFor="api_selector">Use New API</label>
      </div>
      {useNew ? newAPI : oldAPI}
    </StrictMode>
  )
}
