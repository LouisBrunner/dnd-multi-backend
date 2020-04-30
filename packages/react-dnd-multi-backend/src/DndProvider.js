import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import MultiBackend, { PreviewManager, PreviewList } from 'dnd-multi-backend';

export const PreviewsContext = React.createContext(PreviewManager);
export const PreviewPortalContext = React.createContext(null);

export const DndProvider = ({options, ...props}) => {
  const [previews] = useState(() => new PreviewList());
  const newOptions = Object.assign({}, options, {previews});
  const previewPortal = useRef();

  return (
    <PreviewsContext.Provider value={previews}>
      <PreviewPortalContext.Provider value={previewPortal.current}>
        <ReactDndProvider backend={MultiBackend} options={newOptions} {...props} />
        <div ref={previewPortal} />
      </PreviewPortalContext.Provider>
    </PreviewsContext.Provider>
  );
};

DndProvider.propTypes = {
  manager: PropTypes.any,
  context: PropTypes.any,
  options: PropTypes.any,
  debugMode: PropTypes.bool,
};
