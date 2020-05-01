import { useState, useEffect, useContext } from 'react';

import { PreviewsContext } from './DndProvider';

const useObservePreviews = () => {
  const [enabled, setEnabled] = useState(false);
  const previews = useContext(PreviewsContext);

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

  return enabled;
};

export { useObservePreviews };
