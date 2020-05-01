import { useContext } from 'react';
import { DndContext } from 'react-dnd';

const useForBackend = (spec, fn, manager, backend) => {
  const previous = manager.getBackend();
  manager.receiveBackend(backend);
  const result = fn(spec);
  manager.receiveBackend(previous);
  return result;
};

const useMultiCommon = (spec, fn) => {
  const result = fn(spec);
  const dndContext = useContext(DndContext);

  const multiResult = {};
  for (const backend of dndContext.dragDropManager.getBackend().backendsList) {
    multiResult[backend.id] = useForBackend(spec, fn, dndContext.dragDropManager, backend.instance);
  }

  return [result, multiResult];
};

export { useMultiCommon };
