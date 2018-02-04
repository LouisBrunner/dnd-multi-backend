import { expect } from 'tests/framework';
import { Mock } from 'sinon-spy-utils';

import * as Module from '../index';

import Preview from '../Preview';
import MultiBackend, { HTML5DragTransition, TouchTransition, MouseTransition, createTransition } from 'dnd-multi-backend';


describe('ReactDnDMultiBackend module', () => {
  it('exports a function to create MultiBackend', () => {
    expect(Module.default).to.be.an.instanceof(Function);

    const fakeManager = Mock('getMonitor', 'getActions', 'getRegistry', 'getContext');
    expect(Module.default).to.equal(MultiBackend);
    expect(() => { Module.default(fakeManager); }).to.throw(Error, 'You must specify at least one Backend');
  });

  it('exports utils components', () => {
    expect(Module.Preview).to.equal(Preview);
    expect(Module.HTML5DragTransition).to.equal(HTML5DragTransition);
    expect(Module.TouchTransition).to.equal(TouchTransition);
    expect(Module.MouseTransition).to.equal(MouseTransition);
    expect(Module.createTransition).to.equal(createTransition);
  });
});
