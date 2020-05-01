import React, { useContext, useRef, useState } from 'react';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import MultiBackend, { DndProvider, PreviewContext, usePreview, Preview } from '../src';
import HTML5toTouch from '../src/HTML5toTouch';
import Card from './Card';
import Basket from './Basket';

const generatePreview = (row, text, item, style) => {
  return <div style={{
    ...style,
    top: `${row * 60}px`,
    backgroundColor: item.color,
    width: '50px',
    height: '50px',
    whiteSpace: 'nowrap',
  }}>Generated {text}</div>;
};

const ContextPreview = ({text}) => { // eslint-disable-line react/prop-types
  const {style, item} = useContext(PreviewContext);
  return generatePreview(0, `${text} with Context`, item, style);
};

const HookPreview = ({text}) => { // eslint-disable-line react/prop-types
  const {display, style, item} = usePreview();
  if (!display) {
    return null;
  }
  return generatePreview(1, `${text} with Hook`, item, style);
};

const ComponentPreview = ({text}) => { // eslint-disable-line react/prop-types
  return (
    <Preview generator={({item, style}) => {
      return generatePreview(2, `${text} with Component`, item, style);
    }} />
  );
};

const getContent = (title, ref) => {
  return (
    <>
      <h1>{title} API</h1>
      <Card color="#cc2211" />
      <Card color="#22cc11" />
      <Card color="#2211cc" />
      <Basket logs={ref} />

      <Preview>
        <ContextPreview text={title} />
      </Preview>
      <HookPreview text={title} />
      <ComponentPreview text={title} />

      <div ref={ref} />
    </>
  );
};

const App = () => {
  const [useNew, setAPI] = useState(true);

  const refOld = useRef();
  const refNew = useRef();

  const oldAPI = (
    <ReactDndProvider backend={MultiBackend} options={HTML5toTouch}>
      {getContent('Old', refOld)}
    </ReactDndProvider>
  );

  const newAPI = (
    <DndProvider options={HTML5toTouch}>
      {getContent('New', refNew)}
    </DndProvider>
  );

  return (
    <React.StrictMode>
      <div>
        <input id="api_selector" type="checkbox" checked={useNew} onChange={(e) => setAPI(e.target.checked)} />
        <label htmlFor="api_selector">Use New API</label>
      </div>
      {useNew ? newAPI : oldAPI}
    </React.StrictMode>
  );
};

export default App;
