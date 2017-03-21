import { expect, sinon } from 'tests/framework';

import * as Module from '../index';

import MultiBackend from '../MultiBackend';
import HTML5toTouch from '../HTML5toTouch';

import Preview from '../Preview';
import TouchTransition from '../TouchTransition';
import createTransition from '../createTransition';


describe('ReactDnDMultiBackend module', () => {
  it('exports a function to create MultiBackend', () => {
    expect(Module.default).to.be.an.instanceof(Function);

    const fakeManager = {getMonitor: sinon.stub(), getActions: sinon.stub(), getRegistry: sinon.stub(), getContext: sinon.stub()};
    expect(Module.default(HTML5toTouch)(fakeManager)).to.be.an.instanceof(MultiBackend);
    expect(() => { Module.default(fakeManager); }).to.throw(Error, 'You must specify at least one Backend');
  });

  it('exports utils components', () => {
    expect(Module.Preview).to.equal(Preview);
    expect(Module.TouchTransition).to.equal(TouchTransition);
    expect(Module.createTransition).to.equal(createTransition);
  });
});
