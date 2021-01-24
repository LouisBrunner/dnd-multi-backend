import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider as ReactDndProvider } from 'react-dnd';

import { MultiBackend, DndProvider, PreviewContext, usePreview, Preview } from '../src';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';

import Card from './Card';
import Basket from './Basket';

import MultiCard from './MultiCard';
import MultiBasket from './MultiBasket';

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

const ContextPreview = ({text}) => {
  const {style, item} = useContext(PreviewContext);
  return generatePreview(0, `${text} with Context`, item, style);
};

const HookPreview = ({text}) => {
  const {display, style, item} = usePreview();
  if (!display) {
    return null;
  }
  return generatePreview(1, `${text} with Hook`, item, style);
};

const ComponentPreview = ({text}) => {
  return (
    <Preview generator={({item, style}) => {
      return generatePreview(2, `${text} with Component`, item, style);
    }} />
  );
};

ComponentPreview.propTypes = {
  text: PropTypes.string,
};

const getContent = (title, ref) => {
  return (
    <>
      <h2>{title} API</h2>
      <Card color="#cc2211" />
      <Card color="#22cc11" />
      <Card color="#2211cc" />
      <Basket logs={ref} />

      <br />

      <MultiCard color="#33ff77" />
      <MultiBasket logs={ref} />

      <br />

      <div ref={ref} />

      <Preview>
        <ContextPreview text={title} />
      </Preview>
      <HookPreview text={title} />
      <ComponentPreview text={title} />
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
