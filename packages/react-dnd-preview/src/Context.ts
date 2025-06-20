import {createContext} from 'react'
import type {usePreviewStateContent} from './usePreview.js'

export type PreviewState<T = unknown, El extends Element = Element> = usePreviewStateContent<T, El>

export const Context = createContext<PreviewState | undefined>(undefined)
