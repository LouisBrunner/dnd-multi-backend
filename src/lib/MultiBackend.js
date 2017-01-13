import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

const Backend = {
  HTML5: 0,
  TOUCH: 1,
  MAX: 2
};

class MultiBackend {
  constructor(manager, sourceOptions) {
    const options = Object.assign({start: Backend.HTML5}, sourceOptions || {});

    this.current = options.start;

    this.backends = [];
    this.backends[Backend.HTML5] = new HTML5Backend(manager);
    this.backends[Backend.TOUCH] = new TouchBackend({enableMouseEvents: true})(manager);

    this.nodes = {};

    const funcs = [
      'setup', 'teardown',
      'connectDragSource', 'connectDragPreview', 'connectDropTarget',
      'previewEnabled',
      'addEventListeners', 'removeEventListeners',
      'backendSwitcher', 'cleanUpHandlers',
      'applyToBackend', 'callBackends',
      'restrictTouchBackend', 'freeTouchBackend'
    ];
    for (let func of funcs) {
      this[func] = this[func].bind(this);
    }
  }

  // DnD Backend API
  setup() {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.constructor.isSetUp) {
      throw new Error('Cannot have two Multi backends at the same time.');
    }
    this.constructor.isSetUp = true;
    this.addEventListeners(window);
    this.backends[this.current].setup();
  }

  teardown() {
    if (typeof window === 'undefined') {
      return;
    }

    this.constructor.isSetUp = false;
    this.removeEventListeners(window);
    this.backends[this.current].teardown();
  }

  connectDragSource() {
    return this.callBackends('connectDragSource', arguments);
  }
  connectDragPreview() {
    return this.callBackends('connectDragPreview', arguments);
  }
  connectDropTarget() {
    return this.callBackends('connectDropTarget', arguments);
  }

  // Use by Preview component
  previewEnabled() {
    return this.current === Backend.TOUCH;
  }

  // Multi Backend Listeners
  addEventListeners(target) {
    target.addEventListener('touchstart', this.backendSwitcher, true);
  }

  removeEventListeners(target) {
    target.removeEventListener('touchstart', this.backendSwitcher, true);
  }

  // Switching logic
  backendSwitcher(event) {
    const oldBackend = this.current;

    if (this.current === Backend.HTML5 && event.touches != null) {
      this.current = Backend.TOUCH;
      this.removeEventListeners(window);
    }

    if (this.current !== oldBackend) {
      this.backends[oldBackend].teardown();
      this.cleanUpHandlers(oldBackend);
      this.backends[this.current].setup();

      if (this.current === Backend.TOUCH) {
        this.freeTouchBackend();
        this.backends[this.current].handleTopMoveStartCapture(event);
        this.backends[this.current].getTopMoveStartHandler()(event);
      }
    }
  }

  cleanUpHandlers(backend) {
    for (let id of Object.keys(this.nodes)) {
      const node = this.nodes[id];
      node.handlers[backend]();
      node.handlers[backend] = null;
    }
  }

  // Which backend should be called
  applyToBackend(backend, func, args) {
    const self = this.backends[backend];
    return self[func].apply(self, args);
  }

  callBackends(func, args) {
    let handlers = [];
    const nodeId = func + '_' + args[0];

    for (let i = 0; i < Backend.MAX; ++i) {
      if (i < this.current) {
        handlers.push(null);
        continue;
      }

      const touchAndNotCurrent = i == Backend.TOUCH && i != this.current;
      if (touchAndNotCurrent) { this.restrictTouchBackend(true); }
      handlers.push(this.applyToBackend(i, func, args));
      if (touchAndNotCurrent) { this.restrictTouchBackend(false); }
    }

    const nodes = this.nodes;
    nodes[nodeId] = {func: func, args: args, handlers: handlers};

    return function () {
      delete nodes[nodeId];      
      for (let i = 0; i < handlers.length; ++i) {
        const handler = handlers[i];
        if (handler) {
          handler(arguments);
        }
      }
    };
  }

  // Special cases for TouchBackend
  restrictTouchBackend(enable) {
    this.backends[Backend.TOUCH].listenerTypes = enable ? ['touch'] : ['touch', 'mouse'];
  }

  freeTouchBackend() {
    for (let id of Object.keys(this.nodes)) {
      const node = this.nodes[id];
      node.handlers[Backend.TOUCH]();
      node.handlers[Backend.TOUCH] = this.applyToBackend(Backend.TOUCH, node.func, node.args);
    }
  }
}
MultiBackend.Backend = Backend;

export default MultiBackend;
