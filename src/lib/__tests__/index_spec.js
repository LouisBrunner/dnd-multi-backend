import { expect } from 'tests/framework';
import { Mock } from 'sinon-spy-utils';

import * as Module from '../index';

import MultiBackend from '../MultiBackend';
import HTML5toTouch from '../HTML5toTouch';

import Preview from '../Preview';
import { HTML5DragTransition, TouchTransition } from '../Transitions';
import createTransition from '../createTransition';


describe('ReactDnDMultiBackend module', () => {
  it('exports a function to create MultiBackend', () => {
    expect(Module.default).to.be.an.instanceof(Function);

    const fakeManager = Mock('getMonitor', 'getActions', 'getRegistry', 'getContext');
    expect(Module.default(HTML5toTouch)(fakeManager)).to.be.an.instanceof(MultiBackend);
    expect(Module.default(fakeManager)).to.be.an.instanceof(MultiBackend);
  });

  it('exports utils components', () => {
    expect(Module.Preview).to.equal(Preview);
    expect(Module.HTML5DragTransition).to.equal(HTML5DragTransition);
    expect(Module.TouchTransition).to.equal(TouchTransition);
    expect(Module.createTransition).to.equal(createTransition);
  });
});
