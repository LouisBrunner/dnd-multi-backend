import React, { useContext, useRef, useState } from 'react';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import MultiBackend, { DndProvider, Preview } from '../src';
import HTML5toTouch from '../src/HTML5toTouch';
import Card from './Card';
import Basket from './Basket';

const GeneratePreview = ({text}) => { // eslint-disable-line react/prop-types
  const {style, item} = useContext(Preview.Context);
  return <div style={{...style, backgroundColor: item.color, width: '50px', height: '50px'}}>Generated {text}</div>;
};

const App = () => {
  const [useNew, setAPI] = useState(true);

  const refOld = useRef();
  const refNew = useRef();

  const oldAPI = (
    <ReactDndProvider backend={MultiBackend} options={HTML5toTouch}>
      <h1>Old API</h1>
      <Card color="#cc2211" />
      <Card color="#22cc11" />
      <Card color="#2211cc" />
      <Basket logs={refOld} />
      <Preview>
        <GeneratePreview text="old" />
      </Preview>
      <div ref={refOld} />
    </ReactDndProvider>
  );

  const newAPI = (
    <DndProvider options={HTML5toTouch}>
      <h1>New API</h1>
      <Card color="#cc2211" />
      <Card color="#22cc11" />
      <Card color="#2211cc" />
      <Basket logs={refNew} />
      <Preview>
        <GeneratePreview text="new" />
      </Preview>
      <div ref={refNew} />
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
