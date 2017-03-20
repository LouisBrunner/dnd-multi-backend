export default class {
  constructor(manager, sourceOptions) {
    const options = Object.assign({backends: []}, sourceOptions || {});

    if (options.backends.length < 1) {
      throw new Error('You must at least specify one Backend');
    }

    this.current = 0;

    this.backends = [];
    for (let backend of options.backends) {
      if (!backend.backend) {
        throw new Error(`You must specify a 'backend' property in your Backend entry: ${backend}`);
      }
      const transition = backend.transition;
      if (transition && !transition._isMBTransition) {
        throw new Error(`You must specify a valid 'transition' property (either undefined or the return of 'createTransition') in your Backend entry: ${backend}`);
      }
      this.backends.push({
        instance: new backend.backend(manager),
        preview: (backend.preview || false),
        transition: transition
      });
    }

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
    this.backends[this.current].instance.setup();
  }

  teardown() {
    if (typeof window === 'undefined') {
      return;
    }

    this.constructor.isSetUp = false;
    this.removeEventListeners(window);
    this.backends[this.current].instance.teardown();
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

  // Used by Preview component
  previewEnabled() {
    return this.backends[this.current].preview;
  }

  // Multi Backend Listeners
  addEventListeners(target) {
    for (let backend in this.backends) {
      if (backend.transition) {
        target.addEventListener(backend.transition.event, this.backendSwitcher, true);
      }
    }
  }

  removeEventListeners(target) {
    for (let backend in this.backends) {
      if (backend.transition) {
        target.removeEventListener(backend.transition.event, this.backendSwitcher, true);
      }
    }
  }

  // Switching logic
  backendSwitcher(event) {
    const oldBackend = this.current;

    let i = 0;
    for (let backend in this.backends) {
      if (i != this.current && backend.transition && backend.transition.check(event)) {
        this.current = i;
        break;
      }
      i += 1;
    }

    if (this.current !== oldBackend) {
      this.backends[oldBackend].instance.teardown();
      this.cleanUpHandlers(oldBackend);
      this.backends[this.current].instance.setup();

      if (this.current === 1) { // TODO: fix
        this.freeTouchBackend();
      }
      event.target.dispatch(event);
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
    const self = this.backends[backend].instance;
    return self[func].apply(self, args);
  }

  callBackends(func, args) {
    const handlers = [];
    const nodeId = func + '_' + args[0];

    for (let i = 0; i < this.backends.length; ++i) {
      if (i < this.current) {
        handlers.push(null);
        continue;
      }
      const touchAndNotCurrent = i === 1 && i != this.current; // TODO: fix
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

  // TODO: fix
  // Special cases for TouchBackend
  restrictTouchBackend(enable) {
    this.backends[1].instance.listenerTypes = enable ? ['touch'] : ['touch', 'mouse'];
  }

  freeTouchBackend() {
    for (let id of Object.keys(this.nodes)) {
      const node = this.nodes[id];
      node.handlers[1]();
      node.handlers[1] = this.applyToBackend(1, node.func, node.args);
    }
  }
}
