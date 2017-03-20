import MultiBackend from './MultiBackend';
import Preview from './Preview';
import TouchTransition from './TouchTransition';
import createTransition from './createTransition';

export { Preview, TouchTransition, createTransition };

export default (managerOrOptions) => {
  if (managerOrOptions.getMonitor) {
    return new MultiBackend(managerOrOptions);
  } else {
    return (manager) => {
      return new MultiBackend(manager, managerOrOptions);
    };
  }
};
