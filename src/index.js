import MultiBackend from './MultiBackend';
import PreviewComponent from './Preview';

export const Preview = PreviewComponent;

export default function createMultiBackend(managerOrOptions) {
  if (managerOrOptions.getMonitor) {
    return new MultiBackend(managerOrOptions);
  } else {
    return function (manager) {
      return new MultiBackend(manager, managerOrOptions);
    };
  }
}
