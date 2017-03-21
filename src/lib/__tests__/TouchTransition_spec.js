import { expect } from 'tests/framework';

import TouchTransition from '../TouchTransition';

describe('TouchTransition object', () => {
  it('calls createTransition correctly', () => {
    expect(TouchTransition._isMBTransition).to.equal(true);
    expect(TouchTransition.event).to.equal('touchstart');

    expect(TouchTransition.check({touches: true})).to.equal(true);
    expect(TouchTransition.check({click: true})).to.equal(false);
  });
});
