import MultiBackend from './MultiBackend';
import { HTML5DragTransition, TouchTransition } from './Transitions';
import createTransition from './createTransition';

export { HTML5DragTransition, TouchTransition, createTransition };

export default (managerOrOptions) => {
  if (managerOrOptions.getMonitor) {
    return new MultiBackend(managerOrOptions);
  }
  return (manager) => {
    return new MultiBackend(manager, managerOrOptions);
  };
};
