import createTransition from './createTransition';

export const TouchTransition = createTransition('touchstart', (event) => {
  return event.touches != null;
});

export const HTML5DragTransition = createTransition('dragstart', (event) => {
  if (event.type) {
    return event.type.indexOf('drag') !== -1 || event.type.indexOf('drop') !== -1;
  }
  return false;
});
