import type {DragDropMonitor, DragSource as IDragSource, DropTarget as IDropTarget, Identifier} from 'dnd-core'

type createElementProps = {
  text: string
  color: string
}

const createElement = ({text, color}: createElementProps): Element => {
  const p = document.createElement('p')
  const textNode = document.createTextNode(text)
  p.style.cssText = `width: 100px; height: 100px; margin: 10px; padding: 5px; background: ${color}`
  p.appendChild(textNode)
  return p
}

export class DragSource implements IDragSource {
  #node: Element
  #color: string

  constructor({text, color}: createElementProps) {
    this.#node = createElement({text, color})
    this.#color = color
  }

  node(): Element {
    return this.#node
  }

  beginDrag(_monitor: DragDropMonitor, _targetId: Identifier): void {
    // FIXME: the interface is actually wrong
    // biome-ignore lint/correctness/noVoidTypeReturn: interface is wrong
    return {color: this.#color} as unknown as undefined
  }

  endDrag(_monitor: DragDropMonitor, _targetId: Identifier): void {}

  canDrag(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return true
  }

  isDragging(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return false
  }
}

export class DropTarget<T> implements IDropTarget {
  #node: Element
  #onDrop?: (r: T) => void

  constructor({text, color, onDrop}: createElementProps & {onDrop?: (r: T) => void}) {
    this.#node = createElement({text, color})
    this.#onDrop = onDrop
  }

  node(): Element {
    return this.#node
  }

  canDrop(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return true
  }

  hover(_monitor: DragDropMonitor, _targetId: Identifier): void {}

  drop(monitor: DragDropMonitor, _targetId: Identifier): void {
    this.#onDrop?.(monitor.getItem())
  }
}
