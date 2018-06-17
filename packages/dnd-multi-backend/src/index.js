export { HTML5DragTransition, TouchTransition, MouseTransition } from './Transitions';
export { default as createTransition } from './createTransition';

import MultiBackend, { PreviewManager } from './MultiBackend';

export { MultiBackend, PreviewManager };

export default (managerOrOptions) => {
  if (managerOrOptions.getMonitor) {
    return new MultiBackend(managerOrOptions);
  }
  return (manager) => {
    return new MultiBackend(manager, managerOrOptions);
  };
};
