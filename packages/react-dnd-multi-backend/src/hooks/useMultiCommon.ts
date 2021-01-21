import { useContext } from 'react'
import { DragDropManager, Backend } from 'dnd-core'
import { DndContext, DndContextType } from 'react-dnd'
import { MultiBackendSwitcher } from 'dnd-multi-backend'

type Fn<Spec, Res> = (spec: Spec) => Res

interface DragDropManagerImpl extends DragDropManager {
  receiveBackend(backend: Backend): void
}

const useForBackend = <Spec, Res>(spec: Spec, fn: Fn<Spec, Res>, manager: DragDropManagerImpl, backend: Backend): Res => {
  const previous = manager.getBackend()
  manager.receiveBackend(backend)
  const result = fn(spec)
  manager.receiveBackend(previous)
  return result
}

export const useMultiCommon = <Spec, Res>(spec: Spec, fn: Fn<Spec, Res>): [Res, Record<string, Res>] => {
  const result = fn(spec)
  const dndContext = useContext<DndContextType>(DndContext)

  const multiResult: Record<string, Res> = {}
  const backends = (dndContext?.dragDropManager?.getBackend() as MultiBackendSwitcher).backendsList()
  for (const backend of backends) {
    multiResult[backend.id] = useForBackend(spec, fn, dndContext.dragDropManager as DragDropManagerImpl, backend.instance)
  }

  return [result, multiResult]
}
