import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import DnDPreview, { Context as PreviewContext } from 'react-dnd-preview';
import { PreviewsContext, PreviewPortalContext } from './DndProvider';

const Preview = (props) => {
  const [enabled, setEnabled] = useState(false);
  const previews = useContext(PreviewsContext);
  const portal = useContext(PreviewPortalContext);

  useEffect(() => {
    const observer = {
      backendChanged: (backend) => {
        setEnabled(backend.previewEnabled());
      },
    };

    previews.register(observer);
    return () => {
      previews.unregister(observer);
    };
  }, [previews, setEnabled]);

  if (!enabled) {
    return null;
  }

  const result = <DnDPreview {...props} />;
  if (portal) {
    return ReactDOM.createPortal(result, portal);
  }
  return result;
};

Preview.Context = PreviewContext;
Preview.propTypes = DnDPreview.propTypes;

export { Preview, PreviewContext };
