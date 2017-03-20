import createTransition from './createTransition';

export default createTransition('touchstart', (event) => {
  return event.touches != null;
});
