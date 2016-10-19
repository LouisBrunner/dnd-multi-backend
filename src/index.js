import MultiBackend from './MultiBackend';

export default function createMultiBackend(manager) {
  return new MultiBackend(manager);
}
