import {createContext} from 'react'
import {usePreviewStateContent} from './usePreview'

export type PreviewState<T = unknown, El extends Element = Element> = usePreviewStateContent<T, El>

export const Context = createContext<PreviewState | undefined>(undefined)
