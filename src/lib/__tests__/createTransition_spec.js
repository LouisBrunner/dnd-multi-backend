import { expect, sinon } from 'tests/framework';
import createTransition from '../createTransition';

describe('createTransition function', () => {
  it('creates a valid transition', () => {
    const eventName = 'test_event';
    const func = sinon.stub();

    const transition = createTransition(eventName, func);

    expect(transition._isMBTransition).to.equal(true);
    expect(transition.event).to.equal(eventName);

    const fakeEvent = {secret: Math.random()};
    expect(func).not.to.have.been.called;
    transition.check(fakeEvent);
    expect(func).to.have.been.calledOnce;
    expect(func).to.have.been.calledWithExactly(fakeEvent);
  });
});
