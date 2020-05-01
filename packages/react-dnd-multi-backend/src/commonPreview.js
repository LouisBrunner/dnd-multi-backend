import { useState, useEffect, useContext } from 'react';
import { DndContext } from 'react-dnd';

const useObservePreviews = () => {
  const [enabled, setEnabled] = useState(false);
  const dndContext = useContext(DndContext);

  useEffect(() => {
    const observer = {
      backendChanged: (backend) => {
        setEnabled(backend.previewEnabled());
      },
    };

    const previews = dndContext.dragDropManager.getBackend().previews;
    previews.register(observer);
    return () => {
      previews.unregister(observer);
    };
  }, [dndContext, setEnabled]);

  return enabled;
};

export { useObservePreviews };
