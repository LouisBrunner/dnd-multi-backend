import type {MultiBackendSwitcher, PreviewList, PreviewListener} from './types'

export class PreviewListImpl implements PreviewList {
  /*private*/ #previews: PreviewListener[]

  constructor() {
    this.#previews = []
  }

  register = (preview: PreviewListener): void => {
    this.#previews.push(preview)
  }

  unregister = (preview: PreviewListener): void => {
    while (this.#previews.indexOf(preview) !== -1) {
      this.#previews.splice(this.#previews.indexOf(preview), 1)
    }
  }

  backendChanged = (backend: MultiBackendSwitcher): void => {
    for (const preview of this.#previews) {
      preview.backendChanged(backend)
    }
  }
}
