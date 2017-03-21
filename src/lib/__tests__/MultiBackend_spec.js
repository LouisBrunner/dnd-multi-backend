import { expect, sinon } from 'tests/framework';
import HTML5toTouch from '../HTML5toTouch';
import createTransition from '../createTransition';

import MultiBackend from '../MultiBackend';

describe('MultiBackend class', () => {
  const createBackend = (pipeline = HTML5toTouch, manager = null) => {
    if (manager === null) {
      manager = {
        getMonitor: () => {
          return {
            isDragging: () => {},
            getItemType: () => {},
            getItem: () => {},
            subscribeToOffsetChange: () => {},
            subscribeToStateChange: () => {},
          };
        },
      };
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
    it('does nothing if it has no window');
    it('fails if a backend already exist');
    it('sets up the events and sub-backends');
  });

  describe('teardown function', () => {
    it('does nothing if it has no window');
    it('cleans up the events and sub-backends');
  });

  describe('connectDragSource function', () => {
    it('calls `callBackends` correctly');
  });
  describe('connectDragPreview function', () => {
    it('calls `callBackends` correctly');
  });
  describe('connectDropTarget function', () => {
    it('calls `callBackends` correctly');
  });


  describe('previewEnabled function', () => {
    it('returns the current backend preview attribute');
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

  describe('applyToBackend function', () => {
    it('calls a function on a certain backend');
  });

  describe('callBackends function', () => {
    it('has no test yet');
  });
});
