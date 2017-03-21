import { expect, sinon } from 'tests/framework';
import HTML5toTouch from '../HTML5toTouch';
import createTransition from '../createTransition';

import MultiBackend from '../MultiBackend';

describe('MultiBackend class', () => {
  const createBackend = (pipeline = HTML5toTouch, manager = null) => {
    if (manager === null) {
      manager = {getMonitor: sinon.stub(), getActions: sinon.stub(), getRegistry: sinon.stub(), getContext: sinon.stub()};
    }
    return new MultiBackend(manager, pipeline);
  };

  describe('constructor', () => {
    it('fails if no backend are specified', () => {
      const pipeline = {backends: []};
      expect(() => { createBackend(pipeline); }).to.throw(Error, 'You must specify at least one Backend');
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
      backend.teardown();
    });

    it('fails if a backend already exist', () => {
      const backend = createBackend();
      sinon.stub(backend, 'addEventListeners');
      backend.setup();
      expect(backend.addEventListeners).to.have.been.calledOnce;

      const backend2 = createBackend();
      sinon.stub(backend2, 'addEventListeners');
      expect(() => { backend2.setup(); }).to.throw(Error, 'Cannot have two MultiBackends at the same time.');
      expect(backend2.addEventListeners).not.to.have.been.called;

      backend.teardown();
    });

    it('sets up the events and sub-backends', () => {
      const backend = createBackend();
      sinon.stub(backend, 'addEventListeners');
      sinon.stub(backend.backends[0].instance, 'setup');
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

    it('cleans up the events and sub-backends');
    it('can recreate a second backend');
  });


  describe('connectDragSource function', () => {
    it('calls `callBackends` correctly', () => {
      const backend = createBackend();
      sinon.stub(backend, 'callBackends');
      backend.connectDragSource();
      expect(backend.callBackends).to.have.been.calledOnce;
      expect(backend.callBackends).to.have.been.calledWithExactly('connectDragSource', []);
    });
  });

  describe('connectDragPreview function', () => {
    it('calls `callBackends` correctly', () => {
      const backend = createBackend();
      sinon.stub(backend, 'callBackends');
      backend.connectDragPreview(1);
      expect(backend.callBackends).to.have.been.calledOnce;
      expect(backend.callBackends).to.have.been.calledWithExactly('connectDragPreview', [1]);
    });
  });

  describe('connectDropTarget function', () => {
    it('calls `callBackends` correctly', () => {
      const backend = createBackend();
      sinon.stub(backend, 'callBackends');
      backend.connectDropTarget(1, 2);
      expect(backend.callBackends).to.have.been.calledOnce;
      expect(backend.callBackends).to.have.been.calledWithExactly('connectDropTarget', [1, 2]);
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
    it('registers the backends\' transitions');
  });

  describe('removeEventListeners function', () => {
    it('removes the backends\' transitions');
  });


  describe('backendSwitcher function', () => {
    it('does nothing (no transition)');
    it('switches backend (transition)');
  });


  describe('cleanUpHandlers function', () => {
    it('removes all the handlers for a certain backend');
  });

  describe('callBackends function', () => {
    it('has no test yet');
  });
});
