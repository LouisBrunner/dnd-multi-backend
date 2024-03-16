/* eslint-disable @typescript-eslint/no-explicit-any */

import {DragSource as IDragSource, DropTarget as IDropTarget, DragDropMonitor, Identifier} from 'dnd-core'

type createElementProps = {
  text: string,
  color: string,
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
    return {color: this.#color} as unknown as void
  }

  endDrag(_monitor: DragDropMonitor, _targetId: Identifier): void {}

  canDrag(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return true
  }

  isDragging(_monitor: DragDropMonitor, _targetId: Identifier): boolean {
    return false
  }
}

export class DropTarget implements IDropTarget {
  #node: Element
  #onDrop?: (r: any) => void

  constructor({text, color, onDrop}: createElementProps & {onDrop?: (r: any) => void}) {
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

  drop(monitor: DragDropMonitor, _targetId: Identifier): any {
    this.#onDrop?.(monitor.getItem())
  }
}
