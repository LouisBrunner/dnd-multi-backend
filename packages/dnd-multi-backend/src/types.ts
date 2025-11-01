import type {Backend} from 'dnd-core'

export type Transition = {
  event: string
  check: (e: Event) => boolean
}

export type BackendEntry = {
  id: string
  instance: Backend
  preview: boolean
  transition?: Transition
  skipDispatchOnTransition: boolean
}

export interface MultiBackendSwitcher extends Backend {
  backendsList(): BackendEntry[]
  previewsList(): PreviewList
  previewEnabled(): boolean
}

export interface PreviewListener {
  backendChanged(backend: MultiBackendSwitcher): void
}

export interface PreviewList {
  register(listener: PreviewListener): void
  unregister(listener: PreviewListener): void
  backendChanged(backend: MultiBackendSwitcher): void
}
