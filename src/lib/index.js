import MultiBackend from './MultiBackend';
import Preview from './Preview';
import { HTML5DragTransition, TouchTransition } from './Transitions';
import createTransition from './createTransition';

export { Preview, HTML5DragTransition, TouchTransition, createTransition };

export default (managerOrOptions) => {
  if (managerOrOptions.getMonitor) {
    return new MultiBackend(managerOrOptions);
  }
  return (manager) => {
    return new MultiBackend(manager, managerOrOptions);
  };
};
