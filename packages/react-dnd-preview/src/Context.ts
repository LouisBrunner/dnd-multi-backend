import { createContext } from 'react'
import {usePreviewStateDisplay} from './usePreview'

export type PreviewState = Omit<usePreviewStateDisplay, 'display'>

export const Context = createContext<PreviewState | undefined>(undefined)
