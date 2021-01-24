import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { usePreview } from '../../src';
import { Draggable, Shape } from '../shared';

class Kinds {
  static Default = 'default';
  static Ref = 'ref';
  static CustomClient = 'custom_client';
  static CustomSourceClient = 'custom_source_client';
}

export const Preview = ({kind, text}) => {
  const {display, style, ref, monitor} = usePreview();
  if (!display) {
    return null;
  }

  let finalRef, finalStyle = {...style, opacity: 0.5, whiteSpace: 'nowrap'};
  if (kind === Kinds.Default) {
    // Keep as-is
  } else if (kind === Kinds.Ref) {
    finalRef = ref;
  } else {
    let x, y;
    if (kind === Kinds.CustomClient) {
      x = monitor.getClientOffset().x;
      y = monitor.getClientOffset().y;
    } else if (kind === Kinds.CustomSourceClient) {
      x = monitor.getSourceClientOffset().x;
      y = monitor.getSourceClientOffset().y;
    } else {
      return 'error: unknown kind';
    }
    const transform = `translate(${x}px, ${y}px)`;
    finalStyle = {
      ...finalStyle,
      transform,
      WebkitTransform: transform,
    };
  }

  return <Shape ref={finalRef} style={finalStyle} size={50} color="red">{text}</Shape>;
};

Preview.propTypes = {
  kind: PropTypes.string,
  text: PropTypes.string,
};

export const App = () => {
  const [debug, setDebug] = useState(false);

  return (
    <React.StrictMode>
      <p>
        <input type="checkbox" value={debug} onChange={(e) => {
          setDebug(e.target.checked);
        }} id="debug_mode" />
        <label htmlFor="debug_mode">Debug mode</label>
      </p>
      <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
        <Draggable />
        <Preview text="default" kind={Kinds.Default} />
        <Preview text="with ref" kind={Kinds.Ref} />
        {debug ? (
          <>
            <Preview text="custom ClientOffset" kind={Kinds.CustomClient} />
            <Preview text="custom SourceClientOffset" kind={Kinds.CustomSourceClient} />
          </>
        ) : null}
      </DndProvider>
    </React.StrictMode>
  );
};
