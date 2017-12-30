import { expect } from 'tests/framework';
import { Mock } from 'sinon-spy-utils';

import * as Module from '../index';

import MultiBackend from '../MultiBackend';

import { HTML5DragTransition, TouchTransition } from '../Transitions';
import createTransition from '../createTransition';


describe('ReactDnDMultiBackend module', () => {
  it('exports a function to create MultiBackend', () => {
    expect(Module.default).to.be.an.instanceof(Function);

    const fakeManager = Mock('getMonitor', 'getActions', 'getRegistry', 'getContext');
    expect(Module.default({backends: [{backend: () => {}}]})(fakeManager)).to.be.an.instanceof(MultiBackend);
    expect(() => { Module.default(fakeManager); }).to.throw(Error, 'You must specify at least one Backend');
  });

  it('exports utils components', () => {
    expect(Module.HTML5DragTransition).to.equal(HTML5DragTransition);
    expect(Module.TouchTransition).to.equal(TouchTransition);
    expect(Module.createTransition).to.equal(createTransition);
  });
});
