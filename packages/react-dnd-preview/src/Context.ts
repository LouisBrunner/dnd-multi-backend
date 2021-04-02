import { createContext } from 'react'
import {DragObjectWithType} from 'react-dnd'
import {usePreviewStateContent} from './usePreview'

export type PreviewState<T extends DragObjectWithType = DragObjectWithType, El extends Element = Element> = usePreviewStateContent<T, El>

export const Context = createContext<PreviewState | undefined>(undefined)
