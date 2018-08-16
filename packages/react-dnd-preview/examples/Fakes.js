export class FakeSource {
  constructor(r, g, b) {
    this.color = `rgb(${r}, ${g}, ${b})`;
  }

  canDrag() {
    return true;
  }

  beginDrag() {
    return {color: this.color};
  }

  isDragging() {
    return true;
  }

  endDrag() {}
}

export class FakeTarget {
  canDrop() {
    return true;
  }

  hover() {}

  drop() {}
}
