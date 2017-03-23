import { expect, sinon } from 'tests/framework';
import { Mock } from 'sinon-spy-utils';

import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import { TouchTransition }  from '../Transitions';
import createTransition from '../createTransition';

import MultiBackend from '../MultiBackend';

const oldHTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend({enableMouseEvents: true}),
      preview: true,
      transition: TouchTransition
    }
  ]
};

describe('MultiBackend class', () => {
  const createBackend = (pipeline = oldHTML5toTouch, manager = null) => {
    if (manager === null) {
      manager = Mock('getMonitor', 'getActions', 'getRegistry', 'getContext');
    }
    return new MultiBackend(manager, pipeline);
  };

  describe('constructor', () => {
    it('defaults to HTML5toTouch if no backend are specified', () => {
      const pipeline = {backends: []};
      const backend = createBackend(pipeline);
      expect(backend.backends).to.have.length(2);
      expect(backend.backends[0].instance).not.to.be.undefined;
      expect(backend.backends[0].preview).to.equal(false);
      expect(backend.backends[0].transition).to.be.undefined;
      expect(backend.backends[1].instance).not.to.be.undefined;
      expect(backend.backends[1].preview).to.equal(true);
      expect(backend.backends[1].transition).to.equal(TouchTransition);
    });

    it('fails if a backend lacks the `backend` property', () => {
      const pipeline = {backends: [{}]};
      expect(() => { createBackend(pipeline); }).to.throw(Error, 'You must specify a \'backend\' property in your Backend entry: [object Object]');
    });

    it('fails if a backend specifies an invalid `transition` property', () => {
      const pipeline = {backends: [{backend: {}, transition: {}}]};
      expect(() => { createBackend(pipeline); } ).to.throw(Error, 'You must specify a valid \'transition\' property (either undefined or the return of \'createTransition\') in your Backend entry: [object Object]');
    });

    it('constructs correctly', () => {
      const transition = createTransition('haha', sinon.stub());
      const backend1 = {secret: Math.random()};
      const backend1ctr = sinon.stub().returns(backend1);
      const backend2 = {secret: Math.random()};
      const backend2ctr = sinon.stub().returns(backend2);
      const pipeline = {backends: [
        {backend: backend1ctr},
        {backend: backend2ctr, preview: true, transition}
      ]};
      const manager = {secret: Math.random()};
      const backend = createBackend(pipeline, manager);

      expect(backend.current).to.equal(0);
      expect(backend.nodes).to.deep.equal({});
      expect(backend.backends).to.have.length(2);

      expect(backend1ctr).to.have.been.calledOnce;
      expect(backend1ctr).to.have.been.calledWithExactly(manager);
      expect(backend.backends[0].instance).to.equal(backend1);
      expect(backend.backends[0].preview).to.equal(false);
      expect(backend.backends[0].transition).to.be.undefined;

      expect(backend2ctr).to.have.been.calledOnce;
      expect(backend2ctr).to.have.been.calledWithExactly(manager);
      expect(backend.backends[1].instance).to.equal(backend2);
      expect(backend.backends[1].preview).to.equal(true);
      expect(backend.backends[1].transition).to.equal(transition);
    });
  });


  describe('setup function', () => {
    it('does nothing if it has no window', () => {
      const backend = createBackend();

      const oldWindow = global.window;
      delete global.window;
      sinon.stub(backend, 'addEventListeners');
      backend.setup();
      expect(backend.addEventListeners).not.to.have.been.called;
      global.window = oldWindow;
    });

    it('fails if a backend already exist', () => {
      const backend = createBackend();
      sinon.stub(backend, 'addEventListeners');
      sinon.stub(backend, 'removeEventListeners');
      sinon.stub(backend.backends[0].instance, 'setup');
      sinon.stub(backend.backends[0].instance, 'teardown');
      backend.setup();
      expect(backend.addEventListeners).to.have.been.calledOnce;

      const backend2 = createBackend();
      sinon.stub(backend2, 'addEventListeners');
      sinon.stub(backend2.backends[0].instance, 'setup');
      expect(() => { backend2.setup(); }).to.throw(Error, 'Cannot have two MultiBackends at the same time.');
      expect(backend2.addEventListeners).not.to.have.been.called;

      backend.teardown();
    });

    it('sets up the events and sub-backends', () => {
      const backend = createBackend();
      sinon.stub(backend, 'addEventListeners');
      sinon.stub(backend, 'removeEventListeners');
      sinon.stub(backend.backends[0].instance, 'setup');
      sinon.stub(backend.backends[0].instance, 'teardown');
      backend.setup();
      expect(backend.addEventListeners).to.have.been.calledOnce;
      expect(backend.backends[0].instance.setup).to.have.been.calledOnce;
      backend.teardown();
    });
  });

  describe('teardown function', () => {
    it('does nothing if it has no window', () => {
      const backend = createBackend();

      const oldWindow = global.window;
      delete global.window;
      sinon.stub(backend, 'removeEventListeners');
      backend.teardown();
      expect(backend.removeEventListeners).not.to.have.been.called;
      global.window = oldWindow;
    });

    it('cleans up the events and sub-backends', () => {
      const backend = createBackend();
      sinon.stub(backend, 'addEventListeners');
      sinon.stub(backend, 'removeEventListeners');
      sinon.stub(backend.backends[0].instance, 'setup');
      sinon.stub(backend.backends[0].instance, 'teardown');
      backend.setup();
      expect(backend.addEventListeners).to.have.been.calledOnce;
      backend.teardown();
      expect(backend.removeEventListeners).to.have.been.calledOnce;
      expect(backend.backends[0].instance.teardown).to.have.been.calledOnce;
    });

    it('can recreate a second backend', () => {
      const backend = createBackend();
      sinon.stub(backend, 'addEventListeners');
      sinon.stub(backend, 'removeEventListeners');
      sinon.stub(backend.backends[0].instance, 'setup');
      sinon.stub(backend.backends[0].instance, 'teardown');
      backend.setup();
      expect(backend.addEventListeners).to.have.been.calledOnce;
      backend.teardown();

      const backend2 = createBackend();
      sinon.stub(backend2, 'addEventListeners');
      sinon.stub(backend2, 'removeEventListeners');
      sinon.stub(backend2.backends[0].instance, 'setup');
      sinon.stub(backend2.backends[0].instance, 'teardown');
      backend2.setup();
      expect(backend2.addEventListeners).to.have.been.calledOnce;
      backend2.teardown();
    });
  });


  describe('connectDragSource function', () => {
    it('calls `connectBackend` correctly', () => {
      const backend = createBackend();
      sinon.stub(backend, 'connectBackend');
      backend.connectDragSource();
      expect(backend.connectBackend).to.have.been.calledOnce;
      expect(backend.connectBackend).to.have.been.calledWithExactly('connectDragSource', []);
    });
  });

  describe('connectDragPreview function', () => {
    it('calls `connectBackend` correctly', () => {
      const backend = createBackend();
      sinon.stub(backend, 'connectBackend');
      backend.connectDragPreview(1);
      expect(backend.connectBackend).to.have.been.calledOnce;
      expect(backend.connectBackend).to.have.been.calledWithExactly('connectDragPreview', [1]);
    });
  });

  describe('connectDropTarget function', () => {
    it('calls `connectBackend` correctly', () => {
      const backend = createBackend();
      sinon.stub(backend, 'connectBackend');
      backend.connectDropTarget(1, 2);
      expect(backend.connectBackend).to.have.been.calledOnce;
      expect(backend.connectBackend).to.have.been.calledWithExactly('connectDropTarget', [1, 2]);
    });
  });


  describe('previewEnabled function', () => {
    it('returns the current backend preview attribute', () => {
      const backend = createBackend();
      expect(backend.previewEnabled()).to.equal(false);
      backend.current = 1;
      expect(backend.previewEnabled()).to.equal(true);
    });
  });

  describe('addEventListeners function', () => {
    it('registers the backends\' transitions', () => {
      const backend = createBackend();
      const fakeWindow = {addEventListener: sinon.stub()};
      backend.addEventListeners(fakeWindow);
      expect(fakeWindow.addEventListener).to.have.been.calledOnce;
      expect(fakeWindow.addEventListener).to.have.been.calledWithExactly('touchstart', sinon.match.func, true);
    });
  });

  describe('removeEventListeners function', () => {
    it('removes the backends\' transitions', () => {
      const backend = createBackend();
      const fakeWindow = {removeEventListener: sinon.stub()};
      backend.removeEventListeners(fakeWindow);
      expect(fakeWindow.removeEventListener).to.have.been.calledOnce;
      expect(fakeWindow.removeEventListener).to.have.been.calledWithExactly('touchstart', sinon.match.func, true);
    });
  });


  describe('backendSwitcher function', () => {
    it('does nothing', () => {
      const backend = createBackend();
      expect(backend.current).to.equal(0);
      backend.backendSwitcher({type: 'mousedown'});
      expect(backend.current).to.equal(0);
    });

    it('switches backend and re-calls the event handlers', () => {
      const backend = createBackend();
      expect(backend.current).to.equal(0);

      const fakeEvent = {type: 'touchstart', touches: [], constructor: sinon.stub(), target: {dispatchEvent: sinon.stub()}};
      const clonedEvent = {secret: Math.random()};
      fakeEvent.constructor.returns(clonedEvent);

      const oldHandler = sinon.stub();
      const fakeNode = {func: 'connectDragSource', args: [2, 1, 4], handler: oldHandler};
      const fakeHandler = {secret: Math.random()};
      sinon.stub(backend, 'callBackend').returns(fakeHandler);
      backend.nodes['123'] = fakeNode;

      sinon.stub(backend.backends[0].instance, 'teardown');
      sinon.stub(backend.backends[1].instance, 'setup');
      backend.backendSwitcher(fakeEvent);
      expect(backend.backends[0].instance.teardown).to.have.been.calledOnce;
      expect(backend.backends[1].instance.setup).to.have.been.calledOnce;

      expect(backend.current).to.equal(1);

      expect(fakeEvent.target.dispatchEvent).to.have.been.calledOnce;
      expect(fakeEvent.target.dispatchEvent).to.have.been.calledWithExactly(clonedEvent);

      expect(oldHandler).to.have.been.calledOnce;
      expect(backend.callBackend).to.have.been.calledOnce;
      expect(backend.callBackend).to.have.been.calledWithExactly('connectDragSource', [2, 1, 4]);
      expect(fakeNode.handler).to.equal(fakeHandler);
    });
  });

  describe('callBackend function', () => {
    it('calls the current backend with the specified arguments', () => {
      const backend = createBackend();
      sinon.stub(backend.backends[0].instance, 'connectDragSource');
      sinon.stub(backend.backends[1].instance, 'connectDragSource');

      backend.callBackend('connectDragSource', [3, 2, 1]);
      expect(backend.backends[0].instance.connectDragSource).to.have.been.calledOnce;
      expect(backend.backends[0].instance.connectDragSource).to.have.been.calledWithExactly(3, 2, 1);
      expect(backend.backends[1].instance.connectDragSource).not.to.have.been.called;

      backend.current = 1;
      backend.callBackend('connectDragSource', [3, 2, 1]);
      expect(backend.backends[0].instance.connectDragSource).to.have.been.calledOnce;
      expect(backend.backends[1].instance.connectDragSource).to.have.been.calledOnce;
      expect(backend.backends[1].instance.connectDragSource).to.have.been.calledWithExactly(3, 2, 1);
    });
  });

  describe('connectBackend function', () => {
    it('connects the current backend and registers the node', () => {
      const backend = createBackend();
      const fakeReturn = {secret: Math.random()};
      const fakeHandler = sinon.stub().returns(fakeReturn);
      sinon.stub(backend, 'callBackend').returns(fakeHandler);

      const handler = backend.connectBackend('funcName', [1, 2, 3]);
      expect(backend.callBackend).to.have.been.calledOnce;
      expect(backend.callBackend).to.have.been.calledWithExactly('funcName', [1, 2, 3]);
      expect(backend.nodes).to.have.property('funcName_1');
      const node = backend.nodes['funcName_1'];
      expect(node).to.have.property('func', 'funcName');
      expect(node).to.have.property('args').that.deep.equal([1, 2, 3]);
      expect(node).to.have.property('handler', fakeHandler);

      expect(fakeHandler).not.to.have.been.called;
      const returnValue = handler(3, 2, 1);
      expect(fakeHandler).to.have.been.calledOnce;
      expect(fakeHandler).to.have.been.calledWithExactly(3, 2, 1);
      expect(backend.nodes).not.to.have.property('funcName_1');
      expect(returnValue).to.equal(fakeReturn);
    });
  });
});
