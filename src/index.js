import MultiBackend from './MultiBackend';
import PreviewComponent from './Preview';

export const Preview = PreviewComponent;

export default function createMultiBackend(manager) {
  return new MultiBackend(manager);
}
