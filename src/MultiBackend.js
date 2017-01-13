import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

export default class MultiBackend {
  constructor(manager, sourceOptions) {
    const options = Object.assign({start: 0}, sourceOptions || {});

    this.current = options.start;

    this.backends = [];
    this.backends.push(new HTML5Backend(manager));
    this.backends.push(new TouchBackend({enableMouseEvents: true})(manager));

    const funcs = [
      'setup', 'teardown',
      'mountComponent', 'unmountComponent',
      'addEventListeners', 'removeEventListeners', 'backendSwitcher', 'applyToBackend', 'previewEnabled',
      'connectDragSource', 'connectDragPreview', 'connectDropTarget'
    ];
    for (let func of funcs) {
      this[func] = this[func].bind(this);
    }
  }

  mountComponent(component) {
    this.component = component;
  }

  unmountComponent() {
    this.component = null;
  }

  setup() {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.constructor.isSetUp) {
      throw new Error('Cannot have two Multi backends at the same time.');
    }
    this.constructor.isSetUp = true;
    this.backends[this.current].setup();
    this.addEventListeners(window);
  }

  teardown() {
    if (typeof window === 'undefined') {
      return;
    }

    this.constructor.isSetUp = false;
    this.backends[this.current].teardown();
    this.removeEventListeners(window);
  }


  addEventListeners(target) {
    target.addEventListener('touchstart', this.backendSwitcher);
  }

  removeEventListeners(target) {
    target.removeEventListener('touchstart', this.backendSwitcher);
  }

  backendSwitcher(event) {
    const oldBackend = this.current;
    if (this.current === 0 && event.touches != null) {
      this.current += 1;
      if (this.current == 1) {
        this.backends[this.current].getTopMoveStartHandler()(event);
      }
    }
    if (this.current !== oldBackend) {
      this.backends[oldBackend].teardown();
      this.backends[this.current].setup();
      if (this.component && this.component.switchBackend) {
        this.component.switchBackend(this.current, this.previewEnabled());
      }
    }
  }

  previewEnabled() {
    return this.current === 1;
  }

  applyToBackend(func, args) {
    const self = this.backends[this.current];
    return self[func].apply(self, args);
  }


  connectDragSource() {
    return this.applyToBackend('connectDragSource', arguments);
  }
  connectDragPreview() {
    return this.applyToBackend('connectDragPreview', arguments);
  }
  connectDropTarget() {
    return this.applyToBackend('connectDropTarget', arguments);
  }
}
