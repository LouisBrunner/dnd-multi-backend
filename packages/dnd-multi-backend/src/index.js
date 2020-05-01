export { HTML5DragTransition, TouchTransition, MouseTransition } from './Transitions';
export { default as createTransition } from './createTransition';
export { PreviewList } from './PreviewList';

import MultiBackend from './MultiBackend';
export { MultiBackend };

export default (manager, context, options) => {
  return new MultiBackend(manager, context, options);
};
