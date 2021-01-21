import React, {useState, createContext, ReactNode} from 'react'
import { DndProvider as ReactDndProvider, DndProviderProps as ReactDndProviderProps } from 'react-dnd'
import { MultiBackend, MultiBackendOptions } from 'dnd-multi-backend'

export const PreviewPortalContext = createContext<Element | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DndProviderProps = Omit<ReactDndProviderProps<any, MultiBackendOptions>, 'backend'> & {
  children?: ReactNode,
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
