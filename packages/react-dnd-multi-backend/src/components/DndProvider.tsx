import {MultiBackend, type MultiBackendOptions} from 'dnd-multi-backend'
import {createContext, type JSX, type ReactNode, useState} from 'react'
import {DndProvider as ReactDndProvider} from 'react-dnd'

export const PreviewPortalContext = createContext<Element | null>(null)

// biome-ignore lint/suspicious/noExplicitAny: legacy
export type DndProviderProps<BackendContext = any> = {
  context?: BackendContext
  options: MultiBackendOptions
  children?: ReactNode
  debugMode?: boolean
  portal?: Element
}

// biome-ignore lint/suspicious/noExplicitAny: legacy
export const DndProvider = <T = any>({portal, ...props}: DndProviderProps<T>): JSX.Element => {
  const [previewPortal, setPreviewPortal] = useState<Element | null>(null)

  return (
    <PreviewPortalContext.Provider value={portal ?? previewPortal}>
      <ReactDndProvider backend={MultiBackend} {...props} />
      {portal ? null : <div ref={setPreviewPortal} />}
    </PreviewPortalContext.Provider>
  )
}
