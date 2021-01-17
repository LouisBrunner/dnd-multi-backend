/* eslint-disable no-console */

class DnDBackend {
  constructor(manager, label, startEvents, hoverEvents, stopEvents, {draggable = false} = {}) {
    this.manager = manager;
    this.actions = manager.getActions();

    this.label = label;
    this.startEvents = startEvents;
    this.hoverEvents = hoverEvents;
    this.stopEvents = stopEvents;
    this.draggable = draggable;
  }

  setup() {
    console.log(`${this.label}: setup`);
    for (const event of this.stopEvents) {
      window.addEventListener(event, this.drop);
    }
  }

  teardown() {
    console.log(`${this.label}: teardown`);
    for (const event of this.stopEvents) {
      window.removeEventListener(event, this.drop);
    }
  }

  connectDragSource(sourceId, node, _options) {
    const drag = () => {
      if (this.manager.getMonitor().isDragging()) {
        console.log(`${this.label}: end drag`);
        this.actions.endDrag();
      }

      console.log(`${this.label}: drag`);
      this.actions.beginDrag([sourceId], {
        clientOffset: this.getXY(node),
        getSourceClientOffset: (_id) => { return this.getXY(node); },
      });
    };

    console.log(`${this.label}: add drag source`);
    if (this.draggable) {
      node.setAttribute('draggable', true);
    }
    for (const event of this.startEvents) {
      window.addEventListener(event, drag);
    }

    return () => {
      console.log(`${this.label}: remove drag source`);
      for (const event of this.startEvents) {
        window.removeEventListener(event, drag);
      }
      if (this.draggable) {
        node.setAttribute('draggable', false);
      }
    };
  }

  connectDragPreview(_previewId, _node, _options) {
    return () => {};
  }

  connectDropTarget(targetId, node, _options) {
    const hover = (e) => {
      if (!this.manager.getMonitor().isDragging()) {
        return;
      }

      console.log(`${this.label}: hover`);
      this.actions.hover([targetId], {
        clientOffset: this.getXY(node),
      });
      if (this.draggable && this.manager.getMonitor().canDropOnTarget(targetId)) {
        e.preventDefault();
      }
    };

    console.log(`${this.label}: add drop target`);
    for (const event of this.hoverEvents) {
      window.addEventListener(event, hover);
    }

    return () => {
      console.log(`${this.label}: remove drop target`);
      for (const event of this.hoverEvents) {
        window.removeEventListener(event, hover);
      }
    };
  }

  drop = () => {
    console.log(`${this.label}: drop`);
    this.actions.drop();
    this.actions.endDrag();
  }

  getXY(node) {
    const { top: x, left: y } = node.getBoundingClientRect();
    return {x, y};
  }
}

class HTML5BackendImpl extends DnDBackend {
  constructor(manager) {
    super(manager, 'HTML5', ['dragstart'], ['dragover', 'dragenter'], ['drop'], {draggable: true});
  }
}

export const HTML5Backend = (manager) => {
  return new HTML5BackendImpl(manager);
};

class TouchBackendImpl extends DnDBackend {
  constructor(manager) {
    super(manager, 'Touch', ['touchstart', 'mousedown'], ['touchmove', 'mousemove'], ['touchend', 'mouseup']);
  }
}

export const TouchBackend = (manager) => {
  return new TouchBackendImpl(manager);
};
