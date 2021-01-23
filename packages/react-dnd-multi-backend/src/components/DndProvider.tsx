import React, {useState, createContext, ReactNode} from 'react'
import { DndProvider as ReactDndProvider } from 'react-dnd'
import { MultiBackend, MultiBackendOptions } from 'dnd-multi-backend'

export const PreviewPortalContext = createContext<Element | null>(null)

export type DndProviderProps = {
  context?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: MultiBackendOptions,
  children?: ReactNode,
  debugMode?: boolean,
  portal?: Element,
}

export const DndProvider = ({portal, ...props}: DndProviderProps): JSX.Element => {
  const [previewPortal, setPreviewPortal] = useState<Element | null>(null)

  return (
    <PreviewPortalContext.Provider value={portal ?? previewPortal}>
      <ReactDndProvider backend={MultiBackend} {...props} />
      {portal ? null : <div ref={setPreviewPortal} />}
    </PreviewPortalContext.Provider>
  )
}
