import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import MultiBackend from 'dnd-multi-backend';

export const PreviewPortalContext = React.createContext(null);

export const DndProvider = (props) => {
  const [previewPortal, setPreviewPortal] = useState(undefined);

  return (
    <PreviewPortalContext.Provider value={previewPortal}>
      <ReactDndProvider backend={MultiBackend} {...props} />
      <div ref={setPreviewPortal} />
    </PreviewPortalContext.Provider>
  );
};

DndProvider.propTypes = {
  manager: PropTypes.any,
  context: PropTypes.any,
  options: PropTypes.any,
  debugMode: PropTypes.bool,
};
