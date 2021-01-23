import React, {useState, createContext, ReactNode} from 'react'
import { DragDropManager } from 'dnd-core'
import { DndProvider as ReactDndProvider } from 'react-dnd'
import { MultiBackend, MultiBackendOptions } from 'dnd-multi-backend'

export const PreviewPortalContext = createContext<Element | null>(null)

export type DndProviderProps = {
  manager: DragDropManager;
} | {
  context?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: MultiBackendOptions,
  children?: ReactNode,
  debugMode?: boolean,
}

export const DndProvider = (props: DndProviderProps): JSX.Element => {
  const [previewPortal, setPreviewPortal] = useState<Element | null>(null)

  return (
    <PreviewPortalContext.Provider value={previewPortal}>
      <ReactDndProvider backend={MultiBackend} {...props} />
      <div ref={setPreviewPortal} />
    </PreviewPortalContext.Provider>
  )
}
