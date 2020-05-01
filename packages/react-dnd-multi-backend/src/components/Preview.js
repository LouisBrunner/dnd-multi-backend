import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import DnDPreview, { Context as PreviewContext } from 'react-dnd-preview';

import { useObservePreviews } from '../common';
import { PreviewPortalContext } from './DndProvider';

const Preview = (props) => {
  const enabled = useObservePreviews();
  const portal = useContext(PreviewPortalContext);
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
