import { expect } from 'tests/framework';

import * as Transitions from '../Transitions';

describe('Transitions collection', () => {
  describe('HTML5DragTransition object', () => {
    it('calls createTransition correctly', () => {
      expect(Transitions.HTML5DragTransition._isMBTransition).to.equal(true);
      expect(Transitions.HTML5DragTransition.event).to.equal('dragstart');

      expect(Transitions.HTML5DragTransition.check({type: 'xxxdragxxx'})).to.equal(true);
      expect(Transitions.HTML5DragTransition.check({type: 'xxxdropxxx'})).to.equal(true);
      expect(Transitions.HTML5DragTransition.check({drag: true})).to.equal(false);
    });
  });

  describe('TouchTransition object', () => {
    it('calls createTransition correctly', () => {
      expect(Transitions.TouchTransition._isMBTransition).to.equal(true);
      expect(Transitions.TouchTransition.event).to.equal('touchstart');

      expect(Transitions.TouchTransition.check({touches: true})).to.equal(true);
      expect(Transitions.TouchTransition.check({click: true})).to.equal(false);
    });
  });
});
