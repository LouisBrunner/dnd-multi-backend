import { expect } from 'tests/framework';
import HTML5toTouch from '../HTML5toTouch';
import TouchTransition from '../TouchTransition';

describe('HTML5toTouch pipeline', () => {
  it('has the HTML5 and Touch backends', () => {
    expect(HTML5toTouch).to.be.an.instanceof(Object);
    expect(HTML5toTouch.backends).to.be.an.instanceof(Array);
    expect(HTML5toTouch.backends).to.have.length(2);

    expect(HTML5toTouch.backends[0]).to.be.an.instanceof(Object);
    expect(HTML5toTouch.backends[0].backend).not.to.be.undefined;

    expect(HTML5toTouch.backends[1]).to.be.an.instanceof(Object);
    expect(HTML5toTouch.backends[1].backend).not.to.be.undefined;
    expect(HTML5toTouch.backends[1].preview).to.equal(true);
    expect(HTML5toTouch.backends[1].transition).to.equal(TouchTransition);
  });
});
