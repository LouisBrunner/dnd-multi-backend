import * as Transitions from '../Transitions';

describe('Transitions collection', () => {
  describe('HTML5DragTransition object', () => {
    test('calls createTransition correctly', () => {
      expect(Transitions.HTML5DragTransition._isMBTransition).toBe(true);
      expect(Transitions.HTML5DragTransition.event).toBe('dragstart');

      expect(Transitions.HTML5DragTransition.check({type: 'xxxdragxxx'})).toBe(true);
      expect(Transitions.HTML5DragTransition.check({type: 'xxxdropxxx'})).toBe(true);
      expect(Transitions.HTML5DragTransition.check({drag: true})).toBe(false);
    });
  });

  describe('TouchTransition object', () => {
    test('calls createTransition correctly', () => {
      expect(Transitions.TouchTransition._isMBTransition).toBe(true);
      expect(Transitions.TouchTransition.event).toBe('touchstart');

      expect(Transitions.TouchTransition.check({touches: true})).toBe(true);
      expect(Transitions.TouchTransition.check({click: true})).toBe(false);
    });
  });

  describe('MouseTransition object', () => {
    test('calls createTransition correctly', () => {
      expect(Transitions.MouseTransition._isMBTransition).toBe(true);
      expect(Transitions.MouseTransition.event).toBe('mousedown');

      expect(Transitions.MouseTransition.check({touches: true})).toBe(false);
      expect(Transitions.MouseTransition.check({click: true})).toBe(false);
      expect(Transitions.MouseTransition.check({type: 'abc'})).toBe(false);
      expect(Transitions.MouseTransition.check({type: 'xyztouchxyz'})).toBe(false);
      expect(Transitions.MouseTransition.check({type: 'xyztouchamousexyz'})).toBe(false);
      expect(Transitions.MouseTransition.check({type: 'xyzmousexyz'})).toBe(true);
    });
  });
});
