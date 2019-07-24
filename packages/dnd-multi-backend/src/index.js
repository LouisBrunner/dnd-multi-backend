export { HTML5DragTransition, TouchTransition, MouseTransition } from './Transitions';
export { default as createTransition } from './createTransition';

import MultiBackend, { PreviewManager } from './MultiBackend';

export { MultiBackend, PreviewManager };

export default (manager, context, options) => {
  return new MultiBackend(manager, context, options);
};
