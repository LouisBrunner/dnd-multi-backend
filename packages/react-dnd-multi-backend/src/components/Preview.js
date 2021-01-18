import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Preview as DnDPreview, Context as PreviewContext } from 'react-dnd-preview';

import {useObservePreviews} from '../useObservePreviews';
import { PreviewPortalContext } from './DndProvider';

export const Preview = (props) => {
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

export { PreviewContext };
