import { createContext } from 'react'
import {usePreviewStateFull} from './usePreview'

export type PreviewState = Omit<usePreviewStateFull, 'display'>

export const Context = createContext<PreviewState | undefined>(undefined)
