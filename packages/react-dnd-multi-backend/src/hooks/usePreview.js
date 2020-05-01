import { usePreview as usePreviewDnd } from 'react-dnd-preview';

import { useObservePreviews } from '../common';

const usePreview = () => {
  const enabled = useObservePreviews();
  const result = usePreviewDnd();
  if (!enabled) {
    return {display: false};
  }

  return result;
};

export { usePreview };
