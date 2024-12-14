import {MultiBackend, type MultiBackendOptions} from 'dnd-multi-backend'
import {type ReactNode, createContext, useState} from 'react'
import {DndProvider as ReactDndProvider} from 'react-dnd'

export const PreviewPortalContext = createContext<Element | null>(null)

export type DndProviderProps = {
  // biome-ignore lint/suspicious/noExplicitAny: not sure why
  context?: any
  options: MultiBackendOptions
  children?: ReactNode
  debugMode?: boolean
  portal?: Element
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
