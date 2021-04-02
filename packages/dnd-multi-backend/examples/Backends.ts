/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import {DragDropManager, DragDropActions, BackendFactory, Backend, Unsubscribe} from 'dnd-core'

type Options = {
  draggable?: boolean,
}

class DnDBackend implements Backend {
  #manager: DragDropManager
  #actions: DragDropActions
  #label: string
  #startEvents: string[]
  #hoverEvents: string[]
  #stopEvents: string[]
  #draggable: boolean

  constructor(manager: DragDropManager, label: string, startEvents: string[], hoverEvents: string[], stopEvents: string[], {draggable = false}: Options = {}) {
    this.#manager = manager
    this.#actions = manager.getActions()
    this.#label = label
    this.#startEvents = startEvents
    this.#hoverEvents = hoverEvents
    this.#stopEvents = stopEvents
    this.#draggable = draggable
  }

  setup(): void {
    console.log(`${this.#label}: setup`)
    for (const event of this.#stopEvents) {
      window.addEventListener(event, this.#drop)
    }
  }

  teardown(): void {
    console.log(`${this.#label}: teardown`)
    for (const event of this.#stopEvents) {
      window.removeEventListener(event, this.#drop)
    }
  }

  connectDragSource(sourceId: any, nodeRaw?: any, _options?: any): Unsubscribe {
    const node = nodeRaw as Element

    const drag = () => {
      if (this.#manager.getMonitor().isDragging()) {
        console.log(`${this.#label}: end drag`)
        this.#actions.endDrag()
      }

      console.log(`${this.#label}: drag`)
      this.#actions.beginDrag([sourceId], {
        clientOffset: this.#getXY(node),
        getSourceClientOffset: (_id: unknown): {x: number, y: number} => {
          return this.#getXY(node)
        },
      })
    }

    console.log(`${this.#label}: add drag source`)
    if (this.#draggable) {
      node.setAttribute('draggable', 'true')
    }
    for (const event of this.#startEvents) {
      window.addEventListener(event, drag)
    }

    return () => {
      console.log(`${this.#label}: remove drag source`)
      for (const event of this.#startEvents) {
        window.removeEventListener(event, drag)
      }
      if (this.#draggable) {
        node.setAttribute('draggable', 'false')
      }
    }
  }

  connectDragPreview(_sourceId: any, _node?: any, _options?: any): Unsubscribe {
    return () => {}
  }

  connectDropTarget(targetId: any, node?: any, _options?: any): Unsubscribe {
    const hover = (e: Event) => {
      if (!this.#manager.getMonitor().isDragging()) {
        return
      }

      console.log(`${this.#label}: hover`)
      this.#actions.hover([targetId], {
        clientOffset: this.#getXY(node),
      })
      if (this.#draggable && this.#manager.getMonitor().canDropOnTarget(targetId)) {
        e.preventDefault()
      }
    }

    console.log(`${this.#label}: add drop target`)
    for (const event of this.#hoverEvents) {
      window.addEventListener(event, hover)
    }

    return () => {
      console.log(`${this.#label}: remove drop target`)
      for (const event of this.#hoverEvents) {
        window.removeEventListener(event, hover)
      }
    }
  }

  profile(): Record<string, number> {
    return {}
  }

  #drop = () => {
    console.log(`${this.#label}: drop`)
    this.#actions.drop()
    this.#actions.endDrag()
  }

  #getXY = (node: Element): {x: number, y: number} => {
    const { top: x, left: y } = node.getBoundingClientRect()
    return {x, y}
  }
}

class HTML5BackendImpl extends DnDBackend {
  constructor(manager: DragDropManager) {
    super(manager, 'HTML5', ['dragstart'], ['dragover', 'dragenter'], ['drop'], {draggable: true})
  }
}

export const HTML5Backend: BackendFactory = (manager: DragDropManager) => {
  return new HTML5BackendImpl(manager)
}

class TouchBackendImpl extends DnDBackend {
  constructor(manager: DragDropManager) {
    super(manager, 'Touch', ['touchstart', 'mousedown'], ['touchmove', 'mousemove'], ['touchend', 'mouseup'])
  }
}

export const TouchBackend: BackendFactory = (manager: DragDropManager) => {
  return new TouchBackendImpl(manager)
}
