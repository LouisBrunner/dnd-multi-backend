import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

export default class MultiBackend {
  constructor(manager) {
    this.current = 0;

    this.backends = [];
    this.backends.push(new HTML5Backend(manager));
    this.backends.push(new TouchBackend(manager, {enableMouseEvents: true}));

    this.listeners = [];

    // @component = null
  }

  // TODO
  // mountComponent: (@component) =>
  // unmountComponent: => @component = null

  setup() {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.constructor.isSetUp) {
      throw new Error('Cannot have two Multi backends at the same time.');
    }
    this.constructor.isSetUp = true;
    this.addEventListeners(window);
  }

  teardown() {
    if (typeof window === 'undefined') {
      return;
    }

    this.constructor.isSetUp = false;
    this.removeEventListeners(window);
    this.clearCurrentDragSourceNode();
    if (this.current > 0) {
      this.backends[1].uninstallSourceNodeRemovalObserver()
    }
    this.removeEventListeners(window);
  }

  addEventListeners(target) {
    this.addEventListener(target, 'touchstart', null, this.backendSwitcher)

    for (capture in [false, true]) {
      suffix = capture ? 'Capture' : '';
      this.addEventListener(target, 'dragstart', 0, 'handleTopDragStart' + suffix, capture);
      this.addEventListener(target, 'dragenter', 0, 'handleTopDragEnter' + suffix, capture);
      this.addEventListener(target, 'dragover', 0, 'handleTopDragOver' + suffix, capture)
      this.addEventListener(target, 'drop', 0, 'handleTopDrop' + suffix, capture);
      if (capture) {
        this.addEventListener(target, 'dragend', 0, 'handleTopDragEnd' + suffix, capture);
        this.addEventListener(target, 'dragleave', 0, 'handleTopDragLeave' + suffix, capture);
      }
    }

    for (type in [{start: 'mousedown', move: 'mousemove', end: 'mouseup'}, {start: 'touchstart', move: 'touchmove', end: 'touchend'}]) {
      this.addEventListener(target, type.start, 1, this.backends[1].getTopMoveStartHandler())
      this.addEventListener(target, type.start, 1, 'handleTopMoveStartCapture', true)
      this.addEventListener(target, type.move, 1, 'handleTopMove')
      this.addEventListener(target, type.move, 1, 'handleTopMoveCapture', true)
      this.addEventListener(target, type.end, 1, 'handleTopMoveEndCapture', true)
    }
  }

  addEventListener(target, event, backend, handler, capture) {
    var bound = handler;
    if (backend != null) {
      bound = this.eventHandler.bind(null, event, backend, handler, capture);
    }
    this.listeners.push({event: event, func: bound, capture: capture});
    target.addEventListener(event, bound, capture);
  }

  backendSwitcher(event) {
    var oldBackend = this.current;
    if (this.current === 0 && event.touches != null) {
      this.current += 1;
      this.backends[1].getTopMoveStartHandler()(event);
    }
    if (this.current !== oldBackend) {
      // @component?.switchBackend?(@currentBackend)
    }
  }

  eventHandler(eventName, backend, handler, capture, event) {
    if (backend !== this.current) {
      return;
    }
    this.applyToBackend(handler, [event]);
  }

  removeEventListeners(target) {
    this.listeners.forEach(function(listener) {
      target.removeEventListener(listener.event, listener.func, listener.capture);
    });
    this.listeners = [];
  }

  connectDragSource() {
    this.applyToBackend('connectDragSource', arguments);
  }
  connectDragPreview() {
    this.applyToBackend('connectDragPreview', arguments);
  }
  connectDropTarget() {
    this.applyToBackend('connectDropTarget', arguments);
  }

  applyToBackend(func, args) {
    self = this.backends[this.current];
    if (func instanceof Function) {
      func.apply(self, args);
    } else {
      self[func].apply(self, args);
    }
  }
}
