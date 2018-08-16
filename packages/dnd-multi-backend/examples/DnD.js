const createElement = ({text, color}) => {
  const p = document.createElement('p');
  const textNode = document.createTextNode(text);
  p.style.cssText = `width: 100px; height: 100px; margin: 10px; padding: 5px; background: ${color};`;
  p.appendChild(textNode);
  return p;
};

export class DragSource {
  constructor({text, color}) {
    this._node = createElement({text, color});
    this.color = color;
  }

  node() {
    return this._node;
  }

  canDrag() {
    return true;
  }

  beginDrag() {
    return {color: this.color};
  }

  isDragging() {}
  endDrag() {}
}

export class DropTarget {
  constructor({text, color}) {
    this._node = createElement({text, color});
  }

  node() {
    return this._node;
  }

  canDrop() {
    return true;
  }

  hover() {}
  drop() {}
}
