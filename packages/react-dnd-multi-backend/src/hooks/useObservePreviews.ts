import type {MultiBackendSwitcher} from 'dnd-multi-backend'
import {useContext, useEffect, useState} from 'react'
import {DndContext, type DndContextType} from 'react-dnd'

export const useObservePreviews = (): boolean => {
  const [enabled, setEnabled] = useState<boolean>(false)
  const dndContext = useContext<DndContextType>(DndContext)

  useEffect(() => {
    const backend = dndContext?.dragDropManager?.getBackend() as MultiBackendSwitcher

    const observer = {
      backendChanged: (cbackend: MultiBackendSwitcher) => {
        setEnabled(cbackend.previewEnabled())
      },
    }

    setEnabled(backend.previewEnabled())

    backend.previewsList().register(observer)
    return () => {
      backend.previewsList().unregister(observer)
    }
  }, [dndContext, dndContext.dragDropManager])

  return enabled
}
