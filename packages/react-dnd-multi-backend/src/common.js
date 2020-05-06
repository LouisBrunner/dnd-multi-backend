import { useState, useEffect, useContext } from 'react';
import { DndContext } from 'react-dnd';

const useObservePreviews = () => {
  const [enabled, setEnabled] = useState(false);
  const dndContext = useContext(DndContext);

  useEffect(() => {
    const backend = dndContext.dragDropManager.getBackend();

    const observer = {
      backendChanged: (cbackend) => {
        setEnabled(cbackend.previewEnabled());
      },
    };

    setEnabled(backend.previewEnabled());

    backend.previews.register(observer);
    return () => {
      backend.previews.unregister(observer);
    };
  }, [dndContext, setEnabled]);

  return enabled;
};

export { useObservePreviews };
