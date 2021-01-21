import { useState, useEffect, useContext } from 'react'
import { DndContext, DndContextType } from 'react-dnd'
import { MultiBackendSwitcher } from 'dnd-multi-backend'

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
