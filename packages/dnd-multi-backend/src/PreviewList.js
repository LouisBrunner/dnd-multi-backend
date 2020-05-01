class PreviewList {
  constructor() {
    this.previews = [];
  }

  register = (preview) => {
    this.previews.push(preview);
  }

  unregister = (preview) => {
    let index;
    while ((index = this.previews.indexOf(preview)) !== -1) {
      this.previews.splice(index, 1);
    }
  }

  backendChanged = (backend) => {
    for (const preview of this.previews) {
      preview.backendChanged(backend);
    }
  }
}

export { PreviewList };
