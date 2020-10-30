import { PreviewList } from './PreviewList';

export default class {
  constructor(manager, context, sourceOptions) {
    const options = Object.assign({backends: []}, sourceOptions || {});

    if (options.backends.length < 1) {
      throw new Error(
        `You must specify at least one Backend, if you are coming from 2.x.x (or don't understand this error)
        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-2xx`
      );
    }

    this.current = null;

    this.previews = new PreviewList();

    this.backends = {};
    this.backendsList = [];
    options.backends.forEach((backend) => {
      const backendRecord = this.createBackend(manager, context, backend);
      if (this.current === null) {
        this.current = backendRecord.id;
      }
      this.backends[backendRecord.id] = backendRecord;
      this.backendsList.push(backendRecord);
    });

    this.nodes = {};
  }

  createBackend(manager, context, backend) {
    if (!backend.backend) {
      throw new Error(`You must specify a 'backend' property in your Backend entry: ${backend}`);
    }
    const transition = backend.transition;
    if (transition && !transition._isMBTransition) {
      throw new Error(
        `You must specify a valid 'transition' property (either undefined or the return of 'createTransition') in your Backend entry: ${backend}`
      );
    }

    const instance = backend.backend(manager, context, backend.options);

    let id = backend.id;
    // Try to infer an `id` if one doesn't exist
    if (!backend.id && instance && instance.constructor) {
      id = instance.constructor.name;
      console.warn( // eslint-disable-line no-console
        `Deprecation notice: You are using a pipeline which doesn't include backends' 'id'.
        This might be unsupported in the future, please specify 'id' explicitely for every backend.`
      );
    }
    if (!id) {
      throw new Error(
        `You must specify an 'id' property in your Backend entry: ${Object.stringify(backend)}
        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-5xx`
      );
    }
    if (this.backends[id]) {
      throw new Error(
        `You must specify a unique 'id' property in your Backend entry:
        ${Object.stringify(backend)} (conflicts with: ${Object.stringify(this.backends[id])})`);
    }

    return {
      id: backend.id,
      instance,
      preview: (backend.preview || false),
      transition,
      skipDispatchOnTransition: Boolean(backend.skipDispatchOnTransition),
    };
  }

  // DnD Backend API
  setup = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.constructor.isSetUp) {
      throw new Error('Cannot have two MultiBackends at the same time.');
    }
    this.constructor.isSetUp = true;
    this.addEventListeners(window);
    this.backends[this.current].instance.setup();
  }

  teardown = () => {
    if (typeof window === 'undefined') {
      return;
    }

    this.constructor.isSetUp = false;
    this.removeEventListeners(window);
    this.backends[this.current].instance.teardown();
  }

  connectDragSource = (...args) => {
    return this.connectBackend('connectDragSource', args);
  }
  connectDragPreview = (...args) => {
    return this.connectBackend('connectDragPreview', args);
  }
  connectDropTarget = (...args) => {
    return this.connectBackend('connectDropTarget', args);
  }

  // Used by Preview component
  previewEnabled = () => {
    return this.backends[this.current].preview;
  }

  // Multi Backend Listeners
  addEventListeners = (target) => {
    this.backendsList.forEach((backend) => {
      if (backend.transition) {
        target.addEventListener(backend.transition.event, this.backendSwitcher);
      }
    });
  }

  removeEventListeners = (target) => {
    this.backendsList.forEach((backend) => {
      if (backend.transition) {
        target.removeEventListener(backend.transition.event, this.backendSwitcher);
      }
    });
  }

  // Switching logic
  backendSwitcher = (event) => {
    const oldBackend = this.current;

    this.backendsList.some((backend) => {
      if (backend.id !== this.current && backend.transition && backend.transition.check(event)) {
        this.current = backend.id;
        return true;
      }
      return false;
    });

    if (this.current !== oldBackend) {
      this.backends[oldBackend].instance.teardown();
      Object.keys(this.nodes).forEach((id) => {
        const node = this.nodes[id];
        node.handler();
        node.handler = this.callBackend(node.func, node.args);
      });
      this.previews.backendChanged(this);

      const newBackend = this.backends[this.current];
      newBackend.instance.setup();

      if (newBackend.skipDispatchOnTransition) {
        return;
      }

      let newEvent = null;
      try {
        newEvent = new event.constructor(event.type, event);
      } catch (_e) {
        newEvent = document.createEvent('Event');
        newEvent.initEvent(event.type, event.bubbles, event.cancelable);
      }
      event.target.dispatchEvent(newEvent);
    }
  }

  callBackend = (func, args) => {
    return this.backends[this.current].instance[func](...args);
  }

  connectBackend = (func, args) => {
    const nodeId = `${func}_${args[0]}`;
    const handler = this.callBackend(func, args);
    this.nodes[nodeId] = {func, args, handler};

    return (...subArgs) => {
      const r = this.nodes[nodeId].handler(...subArgs);
      delete this.nodes[nodeId];
      return r;
    };
  }
}
