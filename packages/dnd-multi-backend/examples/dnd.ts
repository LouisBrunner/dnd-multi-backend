import type {DragDropMonitor, DragSource as IDragSource, DropTarget as IDropTarget, Identifier} from 'dnd-core'

type CreateElementProps = {
  text: string
  color: string
}

const createElement = ({text, color}: CreateElementProps): Element => {
  const p = document.createElement('p')
  const textNode = document.createTextNode(text)
  p.style.cssText = `width: 100px; height: 100px; margin: 10px; padding: 5px; background: ${color}`
  p.appendChild(textNode)
  return p
}

export class DragSource implements IDragSource {
  readonly #node: Element
  readonly #color: string

  constructor({text, color}: CreateElementProps) {
    this.#node = createElement({color, text})
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

  // biome-ignore lint/suspicious/noEmptyBlockStatements: interface requires this method even though it's a no-op here
  endDrag(_monitor: DragDropMonitor, _targetId: Identifier): void {}

  canDrag(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return true
  }

  isDragging(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return false
  }
}

export class DropTarget<T> implements IDropTarget {
  readonly #node: Element
  readonly #onDrop?: (r: T) => void

  constructor({text, color, onDrop}: CreateElementProps & {onDrop?: (r: T) => void}) {
    this.#node = createElement({color, text})
    this.#onDrop = onDrop
  }

  node(): Element {
    return this.#node
  }

  canDrop(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return true
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: interface requires this method even though it's a no-op here
  hover(_monitor: DragDropMonitor, _targetId: Identifier): void {}

  drop(monitor: DragDropMonitor, _targetId: Identifier): void {
    this.#onDrop?.(monitor.getItem())
  }
}
